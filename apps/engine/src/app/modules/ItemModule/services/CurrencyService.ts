import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import { CurrencyAmountUpdatedEvent, ItemEngineEvents, RemoveCurrencyFromCharacterEvent } from '../Events';

export class CurrencyService extends EventParser {
   private currencyTracks: Record<string, number> = {};

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [PlayerEngineEvents.PlayerCharacterCreated]: this.handleNewPlayerCreated,
         [ItemEngineEvents.RemoveCurrencyFromCharacter]: this.handleRemoveCurrencyFromCharacter,
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

   handleRemoveCurrencyFromCharacter: EngineEventHandler<RemoveCurrencyFromCharacterEvent> = ({ event }) => {
      this.currencyTracks[event.characterId] = Math.max(0, this.currencyTracks[event.characterId] - event.amount);

      this.engineEventCrator.asyncCeateEvent<CurrencyAmountUpdatedEvent>({
         type: ItemEngineEvents.CurrencyAmountUpdated,
         characterId: event.characterId,
         newAmount: this.currencyTracks[event.characterId],
      });
   };

   getCharacterMoneyById = (characterId: string) => this.currencyTracks[characterId];
}
