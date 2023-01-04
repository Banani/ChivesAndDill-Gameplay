import { EngineModule } from '../../types/EngineModule';
import { AreaNotifier, MapSchemaNotifier } from './notifiers';
import { MapService } from './services/MapService';

export interface MapServices {
   mapService: MapService;
}

export const getMapModule: () => EngineModule<MapServices> = () => {
   return {
      notifiers: [new AreaNotifier(), new MapSchemaNotifier()],
      services: {
         mapService: new MapService(),
      },
   };
};
