import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import { CurrencyAmountUpdatedEvent, ItemEngineEvents } from '../Events';

export class CurrencyService extends EventParser {
   private currencyTracks: Record<string, number> = {};

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [PlayerEngineEvents.PlayerCharacterCreated]: this.handleNewPlayerCreated,
      };
   }

   handleNewPlayerCreated: EngineEventHandler<PlayerCharacterCreatedEvent> = ({ event }) => {
      this.currencyTracks[event.playerCharacter.id] = 45323245;

      this.engineEventCrator.asyncCeateEvent<CurrencyAmountUpdatedEvent>({
         type: ItemEngineEvents.CurrencyAmountUpdated,
         characterId: event.playerCharacter.id,
         newAmount: this.currencyTracks[event.playerCharacter.id],
      });
   };
}
