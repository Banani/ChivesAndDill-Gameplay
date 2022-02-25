import { EngineEvents } from 'apps/engine/src/app/EngineEvents';
import { EventParser } from 'apps/engine/src/app/EventParser';
import { distanceBetweenTwoPoints } from 'apps/engine/src/app/math';
import { omit } from 'lodash';
import { EngineEventHandler, Character, PlayerMovedEvent, CharacterDiedEvent } from '../../../../types';
import { Location } from '@bananos/types';
import { MonsterDiedEvent } from '../../../MonsterModule/Events';
import { Monster } from '../../../MonsterModule/types';
import { ChannelEngine } from '../../engines/ChannelEngine';
import {
   PlayerCastedSpellEvent,
   PlayerCastSpellEvent,
   SpellChannelingFinishedEvent,
   SpellChannelingInterruptedEvent,
   SpellChannelingStartedEvent,
   SpellEngineEvents,
   SpellLandedEvent,
} from '../../Events';
import { ChannelSpell, SpellType } from '../../types/spellTypes';

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
         [SpellEngineEvents.PlayerCastSpell]: this.handlePlayerCastSpell,
         [SpellEngineEvents.SpellChannelingFinished]: this.handleSpellChannelingFinished,
         [EngineEvents.PlayerMoved]: this.handlePlayerMoved,

         // TODO: after migration the channel should be stopped both for caster and target, when one of them is dead
         [EngineEvents.CharacterDied]: this.handleCharacterDied,
      };
   }

   init(engineEventCrator, services) {
      super.init(engineEventCrator);
      this.channelEngine.init(engineEventCrator, services);
   }

   handlePlayerCastSpell: EngineEventHandler<PlayerCastSpellEvent> = ({ event, services }) => {
      if (event.spell.type === SpellType.Channel) {
         this.interruptChanneling(event.casterId);
         const allCharacters = { ...services.characterService.getAllCharacters(), ...services.monsterService.getAllCharacters() };
         const caster = allCharacters[event.casterId];

         if (caster && distanceBetweenTwoPoints(caster.location, event.directionLocation) > event.spell.range) {
            return;
         }

         this.engineEventCrator.asyncCeateEvent<PlayerCastedSpellEvent>({
            type: SpellEngineEvents.PlayerCastedSpell,
            casterId: event.casterId,
            spell: event.spell,
         });

         let castTargetId;

         for (const i in omit(allCharacters, [event.casterId])) {
            if (distanceBetweenTwoPoints(event.directionLocation, allCharacters[i].location) < allCharacters[i].size / 2) {
               castTargetId = allCharacters[i].id;
            }
         }

         let id = `channeling_${this.increment++}`;
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

         this.engineEventCrator.asyncCeateEvent<SpellChannelingStartedEvent>({
            type: SpellEngineEvents.SpellChannelingStarted,
            channelingStartedTime: this.activeChannelSpells[id].creationTime,
            casterId: event.casterId,
            spell: event.spell,
            channelId: id,
         });
      }
   };

   getActiveChannelSpells = () => this.activeChannelSpells;

   handleSpellChannelingFinished: EngineEventHandler<SpellChannelingFinishedEvent> = ({ event, services }) => {
      const allCharacters = { ...services.characterService.getAllCharacters(), ...services.monsterService.getAllCharacters() };
      this.engineEventCrator.asyncCeateEvent<SpellLandedEvent>({
         type: SpellEngineEvents.SpellLanded,
         spell: this.activeChannelSpells[event.channelId].spell,
         caster: this.activeChannelSpells[event.channelId].caster,
         location: allCharacters[this.activeChannelSpells[event.channelId].castTargetId]
            ? allCharacters[this.activeChannelSpells[event.channelId].castTargetId].location
            : this.activeChannelSpells[event.channelId].placeLocation,
      });
      delete this.activeChannelSpells[event.channelId];
   };

   handlePlayerMoved: EngineEventHandler<PlayerMovedEvent> = ({ event }) => {
      if (this.willMovementInterruptCasting(event.characterId)) {
         this.interruptChanneling(event.characterId);
      }
   };

   handleCharacterDied: EngineEventHandler<CharacterDiedEvent> = ({ event }) => {
      this.interruptChanneling(event.characterId);
   };

   handleMonsterDied: EngineEventHandler<MonsterDiedEvent> = ({ event }) => {
      this.interruptChanneling(event.monster.id);
   };

   interruptChanneling = (characterId: string) => {
      if (this.activeChannelSpells[characterId]) {
         this.channelEngine.stopChanneling(characterId);
         delete this.activeChannelSpells[characterId];

         this.engineEventCrator.asyncCeateEvent<SpellChannelingInterruptedEvent>({
            type: SpellEngineEvents.SpellChannelingInterrupted,
            channelId: characterId,
         });
      }
   };

   willMovementInterruptCasting = (characterId: string) =>
      this.activeChannelSpells[characterId] && !this.activeChannelSpells[characterId].spell.canByCastedInMovement;
}
