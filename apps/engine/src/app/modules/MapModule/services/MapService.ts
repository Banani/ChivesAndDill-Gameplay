import { MapDefinition, MapSchema } from '@bananos/types';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import { NewPlayerCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import { MapDefinitionUpdatedEvent, MapEvents, MapUpdatedEvent } from '../Events';
import { MapDbApi } from '../db';

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
        mapDbApi.watchForMapDefinition((data) => {
            const sprites = [data.fullDocument.spriteId];
            this.mapDefinition[data.documentKey['_id']] = sprites;
            this.engineEventCrator.asyncCeateEvent<MapDefinitionUpdatedEvent>({
                type: MapEvents.MapDefinitionUpdated,
                mapDefinition: {
                    [data.documentKey['_id']]: sprites
                },
            });
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
