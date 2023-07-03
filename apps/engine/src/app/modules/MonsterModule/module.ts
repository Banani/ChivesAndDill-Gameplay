import { EngineModule } from '../../types/EngineModule';
import { BossFightEngine, MonsterAggroEngine, MonsterAttackEngine, MonsterMovementEngine, RespawnMonsterEngine } from './engines';
import { CombatStateNotifier } from './notifiers';
import { AggroService, BossFightService, CombatStateService, MonsterAttackService, MonsterMovementService, MonsterRespawnTemplateService, MonsterService, MonsterTemplateService, RespawnService } from './services';

export interface MonsterModuleServices {
    aggroService: AggroService;
    bossFightService: BossFightService;
    monsterAttackService: MonsterAttackService;
    monsterMovementService: MonsterMovementService;
    monsterService: MonsterService;
    respawnService: RespawnService;
    monsterTemplateService: MonsterTemplateService;
    monsterRespawnTemplateService: MonsterRespawnTemplateService;
    combatStateService: CombatStateService;
}

export const getMonsterModule: () => EngineModule<MonsterModuleServices> = () => {
    const bossFightEngine = new BossFightEngine();
    const monsterAttackEngine = new MonsterAttackEngine();
    const monsterMovementEngine = new MonsterMovementEngine();
    const respawnMonsterEngine = new RespawnMonsterEngine();
    const monsterAggroEngine = new MonsterAggroEngine();

    return {
        services: {
            aggroService: new AggroService(monsterAggroEngine),
            bossFightService: new BossFightService(bossFightEngine),
            monsterAttackService: new MonsterAttackService(monsterAttackEngine),
            monsterMovementService: new MonsterMovementService(monsterMovementEngine),
            monsterService: new MonsterService(),
            respawnService: new RespawnService(respawnMonsterEngine),
            monsterTemplateService: new MonsterTemplateService(),
            monsterRespawnTemplateService: new MonsterRespawnTemplateService(),
            combatStateService: new CombatStateService(),
        },
        notifiers: [new CombatStateNotifier()],
        fastEngines: [bossFightEngine, monsterAttackEngine, monsterMovementEngine],
        slowEngines: [respawnMonsterEngine, monsterAggroEngine],
    };
};
