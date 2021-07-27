import { EngineEvents } from 'apps/engine/src/app/EngineEvents';
import { EventParser } from 'apps/engine/src/app/EventParser';
import { distanceBetweenTwoPoints } from 'apps/engine/src/app/math';
import { SpellType } from 'apps/engine/src/app/SpellType';
import { omit } from 'lodash';
import {
   EngineEventHandler,
   PlayerCastSpellEvent,
   PlayerCastedSpellEvent,
   Spell,
   Character,
   Location,
   SpellChannelingFinishedEvent,
   PlayerMovedEvent,
   SpellChannelingInterruptedEvent,
} from '../../../../types';
import { Monster } from '../../../MonsterModule/types';
import { ChannelEngine } from '../../engines/ChannelEngine';
import { FightingEngineEvents, SpellLandedEvent } from '../../Events';

export interface ChannelSpellsTrack {
   id: string;
   creationTime: number;
   spell: Spell;
   placeLocation: Location;
   castTargetId?: string;
   caster: Character | Monster;
}

export class ChannelService extends EventParser {
   channelEngine: ChannelEngine;
   activeChannelSpells: Record<string, ChannelSpellsTrack> = {};

   constructor(channelEngine: ChannelEngine) {
      super();
      this.channelEngine = channelEngine;
      this.eventsToHandlersMap = {
         [EngineEvents.PlayerCastSpell]: this.handlePlayerCastSpell,
         [EngineEvents.SpellChannelingFinished]: this.handleSpellChannelingFinished,
         [EngineEvents.PlayerMoved]: this.handlePlayerMoved,
      };
   }

   init(engineEventCrator, services) {
      super.init(engineEventCrator);
      this.channelEngine.init(engineEventCrator, services);
   }

   handlePlayerCastSpell: EngineEventHandler<PlayerCastSpellEvent> = ({ event, services }) => {
      if (event.spell.type === SpellType.Channel) {
         const allCharacters = { ...services.characterService.getAllCharacters(), ...services.monsterService.getAllCharacters() };
         const character = allCharacters[event.casterId];

         if (distanceBetweenTwoPoints(character.location, event.directionLocation) > event.spell.range) {
            return;
         }

         this.engineEventCrator.createEvent<PlayerCastedSpellEvent>({
            type: EngineEvents.PlayerCastedSpell,
            casterId: character.id,
            spell: event.spell,
         });

         let castTargetId;

         for (const i in omit(allCharacters, [character.id])) {
            if (distanceBetweenTwoPoints(event.directionLocation, allCharacters[i].location) < allCharacters[i].size / 2) {
               castTargetId = allCharacters[i].id;
            }
         }

         this.activeChannelSpells[event.casterId] = {
            id: event.casterId,
            creationTime: Date.now(),
            spell: event.spell,
            placeLocation: event.directionLocation,
            caster: character,
            castTargetId,
         };
      }
   };

   getActiveChannelSpells = () => this.activeChannelSpells;

   handleSpellChannelingFinished: EngineEventHandler<SpellChannelingFinishedEvent> = ({ event, services }) => {
      const allCharacters = { ...services.characterService.getAllCharacters(), ...services.monsterService.getAllCharacters() };
      this.engineEventCrator.createEvent<SpellLandedEvent>({
         type: FightingEngineEvents.SpellLanded,
         spell: this.activeChannelSpells[event.channelId].spell,
         caster: this.activeChannelSpells[event.channelId].caster,
         location: allCharacters[this.activeChannelSpells[event.channelId].castTargetId]
            ? allCharacters[this.activeChannelSpells[event.channelId].castTargetId].location
            : this.activeChannelSpells[event.channelId].placeLocation,
      });
      delete this.activeChannelSpells[event.channelId];
   };

   handlePlayerMoved: EngineEventHandler<PlayerMovedEvent> = ({ event }) => {
      if (this.activeChannelSpells[event.characterId]) {
         this.channelEngine.stopChanneling(event.characterId);
         delete this.activeChannelSpells[event.characterId];

         this.engineEventCrator.createEvent<SpellChannelingInterruptedEvent>({
            type: EngineEvents.SpellChannelingInterrupted,
            channelId: event.characterId,
         });
      }
   };
}
