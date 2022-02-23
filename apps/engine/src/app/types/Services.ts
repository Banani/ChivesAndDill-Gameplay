import type { MonsterModuleServices, QuestModuleServices, SpellModuleServices } from '../modules';
import type { PathFinderService, SocketConnectionService } from '../services';
import type { SchedulerService } from '../services/SchedulerService';
import { PlayerModuleServices } from '../modules/PlayerModule';
import { CharacterModuleServices } from '../modules/CharacterModule/module';

interface CommonServices {
   pathFinderService: PathFinderService;
   schedulerService: SchedulerService;
   socketConnectionService: SocketConnectionService;
}

export type Services = CommonServices & PlayerModuleServices & CharacterModuleServices & QuestModuleServices & MonsterModuleServices & SpellModuleServices;
