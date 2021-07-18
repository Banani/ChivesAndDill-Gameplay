import { KillingQuestService, MovementQuestService, QuestNotifier, QuestProgressService } from '../modules';
import { MonsterAttackService, MonsterService, RespawnService } from '../modules/MonsterModule';
import { MonsterNotifier } from '../modules/MonsterModule/notifiers/MonsterNotifier';
import { AggroService } from '../modules/MonsterModule/services/aggroService';
import { PlayerMovementNotifier, ProjectileNotifier, CharacterEffectNotifier } from '../notifiers';
import { CharactersService, PlayerMovementService, ProjectilesService, DirectHitService, CooldownService, SocketConnectionService } from '../services';

export interface Services {
   characterService: CharactersService;
   playerMovementService: PlayerMovementService;
   projectilesService: ProjectilesService;
   directHitService: DirectHitService;
   playerMovementNotifier: PlayerMovementNotifier;
   projectileNotifier: ProjectileNotifier;
   characterEffectNotifier: CharacterEffectNotifier;
   cooldownService: CooldownService;
   socketConnectionService: SocketConnectionService;
   questProgressService: QuestProgressService;
   movementQuestService: MovementQuestService;
   killingQuestService: KillingQuestService;
   questNotifier: QuestNotifier;
   monsterService: MonsterService;
   respawnService: RespawnService;
   aggroService: AggroService;
   monsterAttackService: MonsterAttackService;
   monsterNotifier: MonsterNotifier;
}
