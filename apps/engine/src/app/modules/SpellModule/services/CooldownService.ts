import { EngineEvents } from '../../../EngineEvents';
import { EngineEventCrator } from '../../../EngineEventsCreator';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import { CharacterEngineEvents, CharacterRemovedEvent, NewCharacterCreatedEvent } from '../../CharacterModule/Events';
import { PlayerCastedSpellEvent, PlayerCastSpellEvent, SpellEngineEvents } from '../Events';
import { Spell } from '../types/spellTypes';

export class CooldownService extends EventParser {
   cooldownHistoryPerUserSpells: Record<string, Record<string, number>> = {};

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [SpellEngineEvents.PlayerCastedSpell]: this.handlePlayerCastedSpell,
         [CharacterEngineEvents.NewCharacterCreated]: this.handleNewCharacterCreated,
         [CharacterEngineEvents.CharacterRemoved]: this.handleCharacterRemoved,
         [SpellEngineEvents.PlayerCastSpell]: this.handlePlayerCastSpell,
         // TODO: CLEAR OLD VALUES ABOUT MONSTER WHEN IT DIES
      };
   }

   init(engineEventCrator: EngineEventCrator) {
      super.init(engineEventCrator);
   }

   handleNewCharacterCreated: EngineEventHandler<NewCharacterCreatedEvent> = ({ event }) => {
      this.cooldownHistoryPerUserSpells[event.character.id] = {};
   };

   handlePlayerCastedSpell: EngineEventHandler<PlayerCastedSpellEvent> = ({ event }) => {
      if (event.casterId) {
         this.cooldownHistoryPerUserSpells[event.casterId][event.spell.name] = Date.now();
      }
   };

   handleCharacterRemoved: EngineEventHandler<CharacterRemovedEvent> = ({ event }) => {
      delete this.cooldownHistoryPerUserSpells[event.character.id];
   };

   isSpellAvailable = (characterId: string, spell: Spell) => {
      if (!this.cooldownHistoryPerUserSpells[characterId]) {
         throw new Error('Character not registered');
      }

      const spellLastCast = this.cooldownHistoryPerUserSpells[characterId][spell.name];

      return spellLastCast ? Date.now() - spellLastCast > spell.cooldown : true;
   };

   handlePlayerCastSpell: EngineEventHandler<PlayerCastSpellEvent> = ({ event }) => {
      if (event.casterId) {
         this.cooldownHistoryPerUserSpells[event.casterId][event.spell.name] = Date.now();
      }
   };
}
