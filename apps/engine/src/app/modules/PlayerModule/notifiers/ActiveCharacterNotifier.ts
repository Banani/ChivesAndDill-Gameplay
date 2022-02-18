import { GlobalStoreModule } from '@bananos/types';
import { cloneDeep } from 'lodash';
import { EventParser } from '../../../EventParser';
import type { MulticastPackage, Notifier } from '../../../Notifier';
import type { EngineEventHandler } from '../../../types';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../Events';

const emptyMulticastPackage: MulticastPackage = { key: GlobalStoreModule.ACTIVE_CHARACTER, messages: {} };

export class ActiveCharacterNotifier extends EventParser implements Notifier {
   multicast: MulticastPackage = cloneDeep(emptyMulticastPackage);

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [PlayerEngineEvents.PlayerCharacterCreated]: this.handlePlayerCharacterCreated,
      };
   }

   getBroadcast = () => {
      return { data: {}, key: GlobalStoreModule.ACTIVE_CHARACTER, toDelete: [] };
   };

   getMulticast = () => {
      const tempMulticast = this.multicast;
      this.multicast = cloneDeep(emptyMulticastPackage);
      return tempMulticast;
   };

   handlePlayerCharacterCreated: EngineEventHandler<PlayerCharacterCreatedEvent> = ({ event, services }) => {
      if (!this.multicast.messages[event.playerCharacter.ownerId]) {
         this.multicast.messages[event.playerCharacter.ownerId] = { events: [], data: {}, toDelete: [] };
      }
      this.multicast.messages[event.playerCharacter.ownerId].data.activeCharacterId = event.playerCharacter.id;
   };
}
