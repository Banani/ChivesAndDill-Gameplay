import { MapDefinition, MapSchema } from '@bananos/types';
import { mapValues } from 'lodash';
import { EngineEventCrator } from '../../../EngineEventsCreator';
import { EventParser } from '../../../EventParser';
import { MapDefinitionUpdatedEvent, MapEvents } from '../Events';

const BLOCK_SIZE = 32;

export class MapService extends EventParser {
    mapDefinition: MapDefinition = {};
    mapSchema: MapSchema = {};

    constructor() {
        super();
        this.eventsToHandlersMap = {};
    }

    mapMapField = (mapField) => ({
        location: {
            x: mapField.x * BLOCK_SIZE,
            y: mapField.y * BLOCK_SIZE,
        },
        path: "http://localhost:3000/photo?path=" + mapField.spriteSheet,
        collision: mapField.collision
    })

    init(engineEventCrator: EngineEventCrator, services) {
        super.init(engineEventCrator);

        let realMapSchemaFetched = false;

        services.dbService.getCachedData("sprites", (mapFields) => {
            if (!realMapSchemaFetched) {
                this.mapSchema = mapValues(mapFields, this.mapMapField);
            }
        });

        services.dbService.fetchDataFromDb("sprites").then((mapFields) => {
            realMapSchemaFetched = true;
            this.mapSchema = mapValues(mapFields, this.mapMapField);
        });

        let realMapFieldsFetched = false;

        services.dbService.getCachedData("mapFields", (mapFields) => {
            if (!realMapFieldsFetched) {
                this.mapDefinition = mapValues(mapFields, (mapField) => mapField.positions);
            }
        });

        services.dbService.fetchDataFromDb("mapFields").then((mapFields) => {
            realMapFieldsFetched = true;
            this.mapDefinition = mapValues(mapFields, (mapField) => mapField.positions);

            this.engineEventCrator.asyncCeateEvent<MapDefinitionUpdatedEvent>({
                type: MapEvents.MapDefinitionUpdated,
                mapDefinition: this.mapDefinition,
            });
        });

        services.dbService.watchForDataChanges("mapFields", (data) => {
            if (data.operationType === "insert") {
                const positions = data.fullDocument.positions;
                this.mapDefinition[data.documentKey['_id']] = positions;
                this.engineEventCrator.asyncCeateEvent<MapDefinitionUpdatedEvent>({
                    type: MapEvents.MapDefinitionUpdated,
                    mapDefinition: {
                        [data.documentKey['_id']]: positions
                    },
                });
            }
        });
    }
}
