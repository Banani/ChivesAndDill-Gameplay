import { AggroService, BossFightService, MonsterAttackService, MonsterMovementService, MonsterService, RespawnService } from './services';
import { EngineModule } from '../../types/EngineModule';
import { BossFightEngine, MonsterAttackEngine, MonsterMovementEngine, RespawnMonsterEngine, MonsterAggroEngine } from './engines';

export interface MonsterModuleServices {
   aggroService: AggroService;
   bossFightService: BossFightService;
   monsterAttackService: MonsterAttackService;
   monsterMovementService: MonsterMovementService;
   monsterService: MonsterService;
   respawnService: RespawnService;
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
      },
      fastEngines: [bossFightEngine, monsterAttackEngine, monsterMovementEngine],
      slowEngines: [respawnMonsterEngine, monsterAggroEngine],
   };
};
