import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler, TakeCharacterSpellPowerEvent } from '../../../types';
import { PlayerCastedSpellEvent, SpellEngineEvents } from '../Events';

export class ManaService extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {
         [SpellEngineEvents.PlayerCastedSpell]: this.handlePlayerCastedSpell,
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
