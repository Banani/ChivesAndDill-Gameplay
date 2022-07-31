import { EngineModule } from '../../types/EngineModule';
import { MonsterRespawnTemplateService, MonsterTemplatesService } from './dataProviders';
import { BossFightEngine, MonsterAggroEngine, MonsterAttackEngine, MonsterMovementEngine, RespawnMonsterEngine } from './engines';
import { AggroService, BossFightService, MonsterAttackService, MonsterMovementService, MonsterService, RespawnService } from './services';

export interface MonsterModuleServices {
   aggroService: AggroService;
   bossFightService: BossFightService;
   monsterAttackService: MonsterAttackService;
   monsterMovementService: MonsterMovementService;
   monsterService: MonsterService;
   respawnService: RespawnService;
   monsterTemplateService: MonsterTemplatesService;
   monsterRespawnTemplateService: MonsterRespawnTemplateService;
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
         monsterTemplateService: new MonsterTemplatesService(),
         monsterRespawnTemplateService: new MonsterRespawnTemplateService(),
      },
      fastEngines: [bossFightEngine, monsterAttackEngine, monsterMovementEngine],
      slowEngines: [respawnMonsterEngine, monsterAggroEngine],
   };
};
