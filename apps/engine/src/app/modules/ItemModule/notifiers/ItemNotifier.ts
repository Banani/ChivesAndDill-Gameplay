import { GlobalStoreModule, ItemClientMessages } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import { ItemEngineEvents, PlayerTriesToDeleteItemEvent } from '../Events';

export class ItemNotifier extends Notifier {
   constructor() {
      super({ key: GlobalStoreModule.ITEMS });
      this.eventsToHandlersMap = {
         [PlayerEngineEvents.PlayerCharacterCreated]: this.handlePlayerCharacterCreated,
      };
   }

   handlePlayerCharacterCreated: EngineEventHandler<PlayerCharacterCreatedEvent> = ({ event, services }) => {
      const currentSocket = services.socketConnectionService.getSocketById(event.playerCharacter.ownerId);

      currentSocket.on(ItemClientMessages.Deleteitem, ({ itemId }) => {
         this.engineEventCrator.asyncCeateEvent<PlayerTriesToDeleteItemEvent>({
            type: ItemEngineEvents.PlayerTriesToDeleteItem,
            requestingCharacterId: event.playerCharacter.id,
            itemId,
         });
      });
   };
}
