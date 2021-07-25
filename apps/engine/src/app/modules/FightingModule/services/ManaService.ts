import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler, PlayerCastedSpellEvent, Spell, TakeCharacterSpellPowerEvent } from '../../../types';

export class ManaService extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {
         [EngineEvents.PlayerCastedSpell]: this.handlePlayerCastedSpell,
      };
   }

   isIsMainSpell = (spell: Spell) => spell.name;

   handlePlayerCastedSpell: EngineEventHandler<PlayerCastedSpellEvent> = ({ event }) => {
      if (this.isIsMainSpell(event.spell)) {
         this.engineEventCrator.createEvent<TakeCharacterSpellPowerEvent>({
            type: EngineEvents.TakeCharacterSpellPower,
            characterId: event.casterId,
            amount: event.spell.spellPowerCost,
         });
      }
   };
}
