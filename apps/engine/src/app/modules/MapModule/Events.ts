import { MapDefinition, MapSchema } from '@bananos/types';
import { EngineEvent, EngineEventHandler } from '../../types';

export enum MapEvents {
   MapUpdated = 'MapUpdated',
}

export interface MapUpdatedEvent extends EngineEvent {
   type: MapEvents.MapUpdated;
   playerId: string;
   mapDefinition: MapDefinition;
   mapSchema: MapSchema;
}

export interface MapEventsMap {
   [MapEvents.MapUpdated]: EngineEventHandler<MapUpdatedEvent>;
}
