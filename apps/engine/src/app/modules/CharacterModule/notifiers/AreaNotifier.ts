import { GlobalStoreModule } from '@bananos/types';
import { AREAS, BORDER } from 'apps/engine/src/map';
import { cloneDeep } from 'lodash';
import { EventParser } from '../../../EventParser';
import type { MulticastPackage, Notifier } from '../../../Notifier';
import type { EngineEventHandler } from '../../../types';
import { NewPlayerCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';

const emptyMulticastPackage: MulticastPackage = { key: GlobalStoreModule.AREAS, messages: {} };

export class AreaNotifier extends EventParser implements Notifier {
   multicast: MulticastPackage = cloneDeep(emptyMulticastPackage);

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [PlayerEngineEvents.NewPlayerCreated]: this.handleNewPlayerCreated,
      };
   }

   getBroadcast = () => {
      return { data: {}, key: GlobalStoreModule.AREAS, toDelete: [] };
   };

   getMulticast = () => {
      const tempMulticast = this.multicast;
      this.multicast = cloneDeep(emptyMulticastPackage);
      return tempMulticast;
   };

   handleNewPlayerCreated: EngineEventHandler<NewPlayerCreatedEvent> = ({ event, services }) => {
      if (!this.multicast.messages[event.playerId]) {
         this.multicast.messages[event.playerId] = { events: [], data: {}, toDelete: [] };
      }
      this.multicast.messages[event.playerId].data.area = AREAS;
      this.multicast.messages[event.playerId].data.border = BORDER;
   };
}
