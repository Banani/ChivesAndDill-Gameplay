import { MapDefinition, MapSchema } from '@bananos/types';
import { EngineEvent, EngineEventHandler } from '../../types';

export enum MapEvents {
   MapUpdated = 'MapUpdated',
   MapDefinitionUpdated = "MapDefinitionUpdated"
}

export interface MapUpdatedEvent extends EngineEvent {
    type: MapEvents.MapUpdated;
    playerId: string;
    mapDefinition: MapDefinition;
    mapSchema: MapSchema;
 }
 
 export interface MapDefinitionUpdatedEvent extends EngineEvent {
    type: MapEvents.MapDefinitionUpdated;
    mapDefinition: MapDefinition;
 }

export interface MapEventsMap {
    [MapEvents.MapUpdated]: EngineEventHandler<MapUpdatedEvent>;
    [MapEvents.MapDefinitionUpdated]: EngineEventHandler<MapDefinitionUpdatedEvent>;
}
