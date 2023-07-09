import { MapDefinition } from '@bananos/types';
import { EngineEvent, EngineEventHandler } from '../../types';

export enum MapEvents {
    MapDefinitionUpdated = "MapDefinitionUpdated"
}

export interface MapDefinitionUpdatedEvent extends EngineEvent {
    type: MapEvents.MapDefinitionUpdated;
    mapDefinition: MapDefinition;
}

export interface MapEventsMap {
    [MapEvents.MapDefinitionUpdated]: EngineEventHandler<MapDefinitionUpdatedEvent>;
}
