import { GlobalStoreModule } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import type { EngineEventHandler } from '../../../types';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../Events';

export class ActiveCharacterNotifier extends Notifier<string> {
   constructor() {
      super({ key: GlobalStoreModule.ACTIVE_CHARACTER });
      this.eventsToHandlersMap = {
         [PlayerEngineEvents.PlayerCharacterCreated]: this.handlePlayerCharacterCreated,
      };
   }

   handlePlayerCharacterCreated: EngineEventHandler<PlayerCharacterCreatedEvent> = ({ event }) => {
      this.multicastMultipleObjectsUpdate([{ receiverId: event.playerCharacter.ownerId, objects: { activeCharacterId: event.playerCharacter.id } }]);
   };
}
