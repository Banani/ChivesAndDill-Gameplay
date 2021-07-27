import { EngineEvents } from '../EngineEvents';
import type { EngineEventCrator } from '../EngineEventsCreator';
import { EventParser } from '../EventParser';
import { EngineEventHandler, NewCharacterCreatedEvent, PlayerCastedSpellEvent, PlayerCastSpellEvent, PlayerDisconnectedEvent } from '../types';
import { ALL_SPELLS } from '../spells';
import { MonsterEngineEvents, NewMonsterCreatedEvent } from '../modules/MonsterModule/Events';

export class CooldownService extends EventParser {
   cooldownHistoryPerUserSpells: Record<string, Record<string, number>> = {};

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [EngineEvents.PlayerCastedSpell]: this.handlePlayerCastedSpell,
         [EngineEvents.NewCharacterCreated]: this.handleNewCharacterCreated,
         [MonsterEngineEvents.NewMonsterCreated]: this.handleNewMonsterCreatedEvent,
         [EngineEvents.PlayerDisconnected]: this.handlePlayerDisconnected,
         [EngineEvents.PlayerCastSpell]: this.handlePlayerCastSpell,
      };
   }

   init(engineEventCrator: EngineEventCrator) {
      super.init(engineEventCrator);
   }

   handlePlayerCastedSpell: EngineEventHandler<PlayerCastedSpellEvent> = ({ event }) => {
      if (event.casterId) {
         this.cooldownHistoryPerUserSpells[event.casterId][event.spell.name] = Date.now();
      }
   };

   handleNewCharacterCreated: EngineEventHandler<NewCharacterCreatedEvent> = ({ event }) => {
      this.cooldownHistoryPerUserSpells[event.payload.newCharacter.id] = {};
   };

   handleNewMonsterCreatedEvent: EngineEventHandler<NewMonsterCreatedEvent> = ({ event }) => {
      this.cooldownHistoryPerUserSpells[event.monster.id] = {};
   };

   handlePlayerDisconnected: EngineEventHandler<PlayerDisconnectedEvent> = ({ event }) => {
      delete this.cooldownHistoryPerUserSpells[event.payload.playerId];
   };

   isSpellAvailable = (characterId: string, spellName: string) => {
      if (!ALL_SPELLS[spellName]) {
         return false;
      }
      const spellLastCast = this.cooldownHistoryPerUserSpells[characterId][spellName];

      return spellLastCast ? Date.now() - spellLastCast > ALL_SPELLS[spellName].cooldown : true;
   };

   handlePlayerCastSpell: EngineEventHandler<PlayerCastSpellEvent> = ({ event }) => {
      if (event.casterId) {
         this.cooldownHistoryPerUserSpells[event.casterId][event.spell.name] = Date.now();
      }
   };
}
