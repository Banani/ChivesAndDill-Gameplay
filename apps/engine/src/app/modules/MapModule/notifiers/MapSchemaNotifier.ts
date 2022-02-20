import { GlobalStoreModule } from '@bananos/types';
import { AREAS, BORDER } from 'apps/engine/src/app/modules/MapModule/map';
import { cloneDeep } from 'lodash';
import { EventParser } from '../../../EventParser';
import type { MulticastPackage, Notifier } from '../../../Notifier';
import type { EngineEventHandler } from '../../../types';
import { NewPlayerCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import { mapDefinition } from '../mapDefinition';
import { mapSchema } from '../mapSchema';

const emptyMulticastPackage: MulticastPackage = { key: GlobalStoreModule.MAP_SCHEMA, messages: {} };

export class MapSchemaNotifier extends EventParser implements Notifier {
   multicast: MulticastPackage = cloneDeep(emptyMulticastPackage);

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [PlayerEngineEvents.NewPlayerCreated]: this.handleNewPlayerCreated,
      };
   }

   getBroadcast = () => {
      return { data: {}, key: GlobalStoreModule.MAP_SCHEMA, toDelete: [] };
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
      this.multicast.messages[event.playerId].data.mapSchema = mapSchema;
      this.multicast.messages[event.playerId].data.mapDefinition = mapDefinition;
   };
}
