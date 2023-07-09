import type { ChatModuleServices, ItemModuleServices, MapServices, MonsterModuleServices, NpcModuleServices, QuestModuleServices, SpellModuleServices } from '../modules';
import { CharacterModuleServices } from '../modules/CharacterModule/module';
import { PlayerModuleServices } from '../modules/PlayerModule';
import type { DbService, PathFinderService, SocketConnectionService } from '../services';
import { RandomGeneratorService } from '../services/RandomGeneratorService';
import type { SchedulerService } from '../services/SchedulerService';

interface CommonServices {
    randomGeneratorService: RandomGeneratorService;
    pathFinderService: PathFinderService;
    schedulerService: SchedulerService;
    socketConnectionService: SocketConnectionService;
    dbService: DbService;
}

export type Services = CommonServices &
    PlayerModuleServices &
    CharacterModuleServices &
    QuestModuleServices &
    MonsterModuleServices &
    SpellModuleServices &
    ChatModuleServices &
    ItemModuleServices &
    NpcModuleServices &
    MapServices;
