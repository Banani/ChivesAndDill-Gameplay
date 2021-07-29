import { EngineEvents } from '../../../EngineEvents';
import { EngineEventCrator } from '../../../EngineEventsCreator';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler, NewPlayerCreatedEvent, PlayerDisconnectedEvent } from '../../../types';
import { MonsterEngineEvents, NewMonsterCreatedEvent } from '../../MonsterModule/Events';
import { PlayerCastedSpellEvent, PlayerCastSpellEvent, SpellEngineEvents } from '../Events';
import { Spell } from '../types/spellTypes';

export class CooldownService extends EventParser {
   cooldownHistoryPerUserSpells: Record<string, Record<string, number>> = {};

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [SpellEngineEvents.PlayerCastedSpell]: this.handlePlayerCastedSpell,
         [EngineEvents.NewPlayerCreated]: this.handleNewPlayerCreated,
         [MonsterEngineEvents.NewMonsterCreated]: this.handleNewMonsterCreatedEvent,
         [EngineEvents.PlayerDisconnected]: this.handlePlayerDisconnected,
         [SpellEngineEvents.PlayerCastSpell]: this.handlePlayerCastSpell,
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

   handleNewPlayerCreated: EngineEventHandler<NewPlayerCreatedEvent> = ({ event }) => {
      this.cooldownHistoryPerUserSpells[event.payload.newCharacter.id] = {};
   };

   handleNewMonsterCreatedEvent: EngineEventHandler<NewMonsterCreatedEvent> = ({ event }) => {
      this.cooldownHistoryPerUserSpells[event.monster.id] = {};
   };

   handlePlayerDisconnected: EngineEventHandler<PlayerDisconnectedEvent> = ({ event }) => {
      delete this.cooldownHistoryPerUserSpells[event.payload.playerId];
   };

   isSpellAvailable = (characterId: string, spell: Spell) => {
      const spellLastCast = this.cooldownHistoryPerUserSpells[characterId][spell.name];

      return spellLastCast ? Date.now() - spellLastCast > spell.cooldown : true;
   };

   handlePlayerCastSpell: EngineEventHandler<PlayerCastSpellEvent> = ({ event }) => {
      if (event.casterId) {
         this.cooldownHistoryPerUserSpells[event.casterId][event.spell.name] = Date.now();
      }
   };
}
