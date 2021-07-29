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

   handlePlayerCastedSpell: EngineEventHandler<PlayerCastedSpellEvent> = ({ event }) => {
      this.engineEventCrator.asyncCeateEvent<TakeCharacterSpellPowerEvent>({
         type: EngineEvents.TakeCharacterSpellPower,
         characterId: event.casterId,
         amount: event.spell.spellPowerCost,
      });
   };
}
