import { GlobalStoreModule } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import { CharacterType, EngineEventHandler } from '../../../types';
import { CurrencyAmountUpdatedEvent, ItemEngineEvents } from '../Events';

export class CurrencyNotifier extends Notifier<number> {
   constructor() {
      super({ key: GlobalStoreModule.CURRENCY });
      this.eventsToHandlersMap = {
         [ItemEngineEvents.CurrencyAmountUpdated]: this.handleCurrencyAmountUpdated,
      };
   }

   handleCurrencyAmountUpdated: EngineEventHandler<CurrencyAmountUpdatedEvent> = ({ event, services }) => {
      const player = services.characterService.getCharacterById(event.characterId);
      if (player.type !== CharacterType.Player) {
         return;
      }

      this.multicastMultipleObjectsUpdate([
         {
            receiverId: player.ownerId,
            objects: { [event.characterId]: event.newAmount },
         },
      ]);
   };
}
