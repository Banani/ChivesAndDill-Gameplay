import { EngineModule } from '../../types/EngineModule';
import { AreaNotifier, MapSchemaNotifier } from './notifiers';

export const getMapModule: () => EngineModule = () => {
   return {
      notifiers: [new AreaNotifier(), new MapSchemaNotifier()],
   };
};
