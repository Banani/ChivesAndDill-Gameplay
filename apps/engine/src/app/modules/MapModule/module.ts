import { EngineModule } from '../../types/EngineModule';
import { MapSchemaNotifier } from './notifiers';
import { CollisionService } from './services/CollisionService';
import { MapService } from './services/MapService';

export interface MapServices {
    mapService: MapService;
    collisionService: CollisionService;
}

export const getMapModule: () => EngineModule<MapServices> = () => {
    return {
        notifiers: [new MapSchemaNotifier()],
        services: {
            mapService: new MapService(),
            collisionService: new CollisionService()
        },
    };
};
