import { GlobalStoreModule, MapDefinition, MapSchema } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { NewPlayerCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import { MapDefinitionUpdatedEvent, MapEvents } from '../Events';

export class MapSchemaNotifier extends Notifier<MapDefinition | MapSchema> {
    constructor() {
        super({ key: GlobalStoreModule.MAP_SCHEMA });
        this.eventsToHandlersMap = {
            [PlayerEngineEvents.NewPlayerCreated]: this.handleNewPlayerCreated,
            [MapEvents.MapDefinitionUpdated]: this.handleMapDefinitionUpdated,
        };
    }

    handleNewPlayerCreated: EngineEventHandler<NewPlayerCreatedEvent> = ({ event, services }) => {
        this.multicastMultipleObjectsUpdate([
            {
                receiverId: event.playerId,
                objects: {
                    mapSchema: services.mapService.mapSchema,
                    mapDefinition: services.mapService.mapDefinition,
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
