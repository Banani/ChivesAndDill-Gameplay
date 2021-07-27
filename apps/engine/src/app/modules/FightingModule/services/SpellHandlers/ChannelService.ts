import { EngineEvents } from 'apps/engine/src/app/EngineEvents';
import { EventParser } from 'apps/engine/src/app/EventParser';
import { distanceBetweenTwoPoints } from 'apps/engine/src/app/math';
import { SpellType } from 'apps/engine/src/app/SpellType';
import { omit } from 'lodash';
import {
   EngineEventHandler,
   PlayerCastSpellEvent,
   PlayerCastedSpellEvent,
   Character,
   Location,
   SpellChannelingFinishedEvent,
   PlayerMovedEvent,
   SpellChannelingInterruptedEvent,
   ChannelSpell,
   CharacterDiedEvent,
} from '../../../../types';
import { MonsterDiedEvent, MonsterEngineEvents } from '../../../MonsterModule/Events';
import { Monster } from '../../../MonsterModule/types';
import { ChannelEngine } from '../../engines/ChannelEngine';
import { FightingEngineEvents, SpellLandedEvent } from '../../Events';

export interface ChannelSpellsTrack {
   id: string;
   creationTime: number;
   spell: ChannelSpell;
   placeLocation: Location;
   castTargetId?: string;
   caster: Character | Monster;
}

export class ChannelService extends EventParser {
   increment: number = 0;
   channelEngine: ChannelEngine;
   activeChannelSpells: Record<string, ChannelSpellsTrack> = {};

   constructor(channelEngine: ChannelEngine) {
      super();
      this.channelEngine = channelEngine;
      this.eventsToHandlersMap = {
         [EngineEvents.PlayerCastSpell]: this.handlePlayerCastSpell,
         [EngineEvents.SpellChannelingFinished]: this.handleSpellChannelingFinished,
         [EngineEvents.PlayerMoved]: this.handlePlayerMoved,
         [EngineEvents.CharacterDied]: this.handleCharacterDied,
         [MonsterEngineEvents.MonsterDied]: this.handleMonsterDied,
      };
   }

   init(engineEventCrator, services) {
      super.init(engineEventCrator);
      this.channelEngine.init(engineEventCrator, services);
   }

   handlePlayerCastSpell: EngineEventHandler<PlayerCastSpellEvent> = ({ event, services }) => {
      if (event.spell.type === SpellType.Channel) {
         const allCharacters = { ...services.characterService.getAllCharacters(), ...services.monsterService.getAllCharacters() };
         const caster = allCharacters[event.casterId];

         if (caster && distanceBetweenTwoPoints(caster.location, event.directionLocation) > event.spell.range) {
            return;
         }

         this.engineEventCrator.createEvent<PlayerCastedSpellEvent>({
            type: EngineEvents.PlayerCastedSpell,
            casterId: event.casterId,
            spell: event.spell,
         });

         let castTargetId;

         for (const i in omit(allCharacters, [event.casterId])) {
            if (distanceBetweenTwoPoints(event.directionLocation, allCharacters[i].location) < allCharacters[i].size / 2) {
               castTargetId = allCharacters[i].id;
            }
         }

         let id = (this.increment++).toString();
         if (event.casterId) {
            id = event.casterId;
         }

         this.activeChannelSpells[id] = {
            id,
            creationTime: Date.now(),
            spell: event.spell,
            placeLocation: event.directionLocation,
            caster: caster,
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
      this.interruptChanneling(event.characterId);
   };

   handleCharacterDied: EngineEventHandler<CharacterDiedEvent> = ({ event }) => {
      this.interruptChanneling(event.character.id);
   };

   handleMonsterDied: EngineEventHandler<MonsterDiedEvent> = ({ event }) => {
      this.interruptChanneling(event.monster.id);
   };

   interruptChanneling = (characterId: string) => {
      if (this.activeChannelSpells[characterId]) {
         this.channelEngine.stopChanneling(characterId);
         delete this.activeChannelSpells[characterId];

         this.engineEventCrator.createEvent<SpellChannelingInterruptedEvent>({
            type: EngineEvents.SpellChannelingInterrupted,
            channelId: characterId,
         });
      }
   };
}
