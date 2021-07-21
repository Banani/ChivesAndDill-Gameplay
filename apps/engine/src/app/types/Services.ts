import {
   DirectInstantSpellService,
   KillingQuestService,
   MovementQuestService,
   QuestNotifier,
   QuestProgressService,
   SpellAvailabilityService,
} from '../modules';
import { DamageEffectService } from '../modules/FightingModule/services/DamageEffectService';
import { HealEffectService } from '../modules/FightingModule/services/HealEffectService';
import { ProjectilesService } from '../modules/FightingModule/services/ProjectilesService';
import { MonsterAttackService, MonsterService, RespawnService } from '../modules/MonsterModule';
import { MonsterNotifier } from '../modules/MonsterModule/notifiers/MonsterNotifier';
import { AggroService } from '../modules/MonsterModule/services/aggroService';
import { PlayerMovementNotifier, ProjectileNotifier, CharacterEffectNotifier } from '../notifiers';
import { CharactersService, PlayerMovementService, CooldownService, SocketConnectionService } from '../services';

export interface Services {
   characterService: CharactersService;
   playerMovementService: PlayerMovementService;
   projectilesService: ProjectilesService;
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
   spellAvailabilityService: SpellAvailabilityService;
   directInstantSpellService: DirectInstantSpellService;
   damageEffectService: DamageEffectService;
   healEffectService: HealEffectService;
}
