import { MapDefinition, MapSchema } from '@bananos/types';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import { NewPlayerCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import { MapDbApi } from '../db';
import { MapEvents, MapUpdatedEvent } from '../Events';

export class MapService extends EventParser {
   mapDefinition: MapDefinition = {};
   mapSchema: MapSchema = {};

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [PlayerEngineEvents.NewPlayerCreated]: this.handleNewPlayerCreated,
      };

      const mapDbApi = new MapDbApi();
      mapDbApi.fetchMapDefinition().then((mapDefinition) => {
         this.mapDefinition = mapDefinition;
      });
      mapDbApi.fetchMapSchema().then((mapSchema) => {
         this.mapSchema = mapSchema;
      });
   }

   handleNewPlayerCreated: EngineEventHandler<NewPlayerCreatedEvent> = ({ event }) => {
      this.engineEventCrator.asyncCeateEvent<MapUpdatedEvent>({
         type: MapEvents.MapUpdated,
         playerId: event.playerId,
         mapDefinition: this.mapDefinition,
         mapSchema: this.mapSchema,
      });
   };
}
