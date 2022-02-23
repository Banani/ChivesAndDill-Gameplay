import { EngineModule } from '../../types/EngineModule';
import { NpcService } from './services/NpcService';

export interface NpcModuleServices {
   npcService: NpcService;
}

export const getNpcModule: () => EngineModule<NpcModuleServices> = () => {
   return {
      services: {
         npcService: new NpcService(),
      },
   };
};
