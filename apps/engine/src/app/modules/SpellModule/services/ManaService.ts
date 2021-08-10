import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import { CharacterEngineEvents, TakeCharacterSpellPowerEvent } from '../../CharacterModule/Events';
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
         type: CharacterEngineEvents.TakeCharacterSpellPower,
         characterId: event.casterId,
         amount: event.spell.spellPowerCost,
      });
   };
}
