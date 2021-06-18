import { EngineEvents } from '../EngineEvents';
import type { EngineEventCrator } from '../EngineEventsCreator';
import { EventParser } from '../EventParser';
import _ from 'lodash';
import { NewCharacterCreatedEvent, PlayerDisconnectedEvent } from '../types';
import { ALL_SPELLS } from '../spells';

export class CooldownService extends EventParser {
   cooldownHistoryPerUserSpells: Record<string, Record<string, number>> = {};

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [EngineEvents.PlayerCastedSpell]: this.handlePlayerCastedSpell,
         [EngineEvents.NewCharacterCreated]: this.handleNewCharacterCreated,
         [EngineEvents.PlayerDisconnected]: this.handlePlayerDisconnected,
      };
   }

   init(engineEventCrator: EngineEventCrator, services) {
      super.init(engineEventCrator);
   }

   handlePlayerCastedSpell = ({ event, services }: { event; services: any }) => {
      this.cooldownHistoryPerUserSpells[event.casterId][event.spell.name] = Date.now();
   };

   handleNewCharacterCreated = ({ event, services }: { event: NewCharacterCreatedEvent; services: any }) => {
      this.cooldownHistoryPerUserSpells[event.payload.newCharacter.id] = {};
   };

   handlePlayerDisconnected = ({ event, services }: { event: PlayerDisconnectedEvent; services: any }) => {
      delete this.cooldownHistoryPerUserSpells[event.payload.playerId];
   };

   isSpellAvailable = (characterId: string, spellName: string) => {
      if (!ALL_SPELLS[spellName]) {
         return false;
      }
      const spellLastCast = this.cooldownHistoryPerUserSpells[characterId][spellName];

      return spellLastCast ? Date.now() - spellLastCast > ALL_SPELLS[spellName].cooldown : true;
   };
}
