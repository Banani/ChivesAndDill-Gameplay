import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler, PlayerCastedSpellEvent, TakeCharacterSpellPowerEvent } from '../../../types';

export class ManaService extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {
         [EngineEvents.PlayerCastedSpell]: this.handlePlayerCastedSpell,
      };
   }

   handlePlayerCastedSpell: EngineEventHandler<PlayerCastedSpellEvent> = ({ event }) => {
      this.engineEventCrator.createEvent<TakeCharacterSpellPowerEvent>({
         type: EngineEvents.TakeCharacterSpellPower,
         characterId: event.casterId,
         amount: event.spell.spellPowerCost,
      });
   };
}
