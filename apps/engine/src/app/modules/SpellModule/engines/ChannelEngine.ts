import { forEach } from 'lodash';
import { Engine } from '../../../Engine';
import { PlayerCastSubSpellEvent, SpellEngineEvents, SpellChannelingFinishedEvent } from '../Events';
import { ChannelSpellsTrack } from '../services/SpellHandlers/ChannelService';

export class ChannelEngine extends Engine {
   tickTime: Record<string, number> = {};

   isNotReadyForHit = (channelSpellsTrack: ChannelSpellsTrack) => {
      if (!this.tickTime[channelSpellsTrack.id]) {
         this.tickTime[channelSpellsTrack.id] = Date.now();
      }
      return this.tickTime[channelSpellsTrack.id] && this.tickTime[channelSpellsTrack.id] + channelSpellsTrack.spell.channelFrequency > Date.now();
   };

   stopChanneling = (channelingId: string) => {
      delete this.tickTime[channelingId];
   };

   doAction() {
      forEach(this.services.channelService.getActiveChannelSpells(), (channelSpell) => {
         const allCharacters = { ...this.services.characterService.getAllCharacters(), ...this.services.monsterService.getAllCharacters() };

         if (this.isNotReadyForHit(channelSpell)) {
            return;
         }
         this.tickTime[channelSpell.id] = Date.now();

         forEach(channelSpell.spell.channelSpells, (spell) => {
            this.eventCrator.createEvent<PlayerCastSubSpellEvent>({
               type: SpellEngineEvents.PlayerCastSubSpell,
               casterId: channelSpell.caster?.id ?? null,
               spell: spell,
               directionLocation: allCharacters[channelSpell.castTargetId] ? allCharacters[channelSpell.castTargetId].location : channelSpell.placeLocation,
               targetId: allCharacters[channelSpell.castTargetId] ? channelSpell.castTargetId : null,
            });
         });

         if (channelSpell.creationTime + channelSpell.spell.channelTime <= Date.now()) {
            delete this.tickTime[channelSpell.id];
            this.eventCrator.createEvent<SpellChannelingFinishedEvent>({
               type: SpellEngineEvents.SpellChannelingFinished,
               channelId: channelSpell.id,
            });
         }
      });
   }
}
