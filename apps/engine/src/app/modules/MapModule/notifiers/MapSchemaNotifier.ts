import { GlobalStoreModule, MapDefinition, MapSchema } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import type { EngineEventHandler } from '../../../types';
import { NewPlayerCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import { mapDefinition } from '../mapDefinition';
import { mapSchema } from '../mapSchema';

export class MapSchemaNotifier extends Notifier<MapDefinition | MapSchema> {
   constructor() {
      super({ key: GlobalStoreModule.MAP_SCHEMA });
      this.eventsToHandlersMap = {
         [PlayerEngineEvents.NewPlayerCreated]: this.handleNewPlayerCreated,
      };
   }

   handleNewPlayerCreated: EngineEventHandler<NewPlayerCreatedEvent> = ({ event }) => {
      this.multicastMultipleObjectsUpdate([
         {
            receiverId: event.playerId,
            objects: {
               mapSchema,
               mapDefinition,
            },
         },
      ]);
   };
}
