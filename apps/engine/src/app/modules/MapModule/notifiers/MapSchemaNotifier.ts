import { GlobalStoreModule, MapDefinition, MapSchema } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { MapDefinitionUpdatedEvent, MapEvents, MapUpdatedEvent } from '../Events';

export class MapSchemaNotifier extends Notifier<MapDefinition | MapSchema> {
    constructor() {
        super({ key: GlobalStoreModule.MAP_SCHEMA });
        this.eventsToHandlersMap = {
            [MapEvents.MapUpdated]: this.handleMapUpdated,
            [MapEvents.MapDefinitionUpdated]: this.handleMapDefinitionUpdated,
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

    handleMapDefinitionUpdated: EngineEventHandler<MapDefinitionUpdatedEvent> = ({ event, services }) => {
        this.broadcastObjectsUpdate({
            objects: {
                mapDefinition: event.mapDefinition
            },
        });
    };
}
