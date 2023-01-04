import { GlobalStoreModule, MapDefinition, MapSchema } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { MapEvents, MapUpdatedEvent } from '../Events';

export class MapSchemaNotifier extends Notifier<MapDefinition | MapSchema> {
   constructor() {
      super({ key: GlobalStoreModule.MAP_SCHEMA });
      this.eventsToHandlersMap = {
         [MapEvents.MapUpdated]: this.handleMapUpdated,
      };
   }

   handleMapUpdated: EngineEventHandler<MapUpdatedEvent> = ({ event, services }) => {
      this.multicastMultipleObjectsUpdate([
         {
            receiverId: event.playerId,
            objects: {
               mapSchema: event.mapSchema,
               mapDefinition: event.mapDefinition,
            },
         },
      ]);
   };
}
