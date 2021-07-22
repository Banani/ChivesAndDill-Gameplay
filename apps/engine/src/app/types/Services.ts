import {
   DamageEffectService,
   DirectInstantSpellService,
   HealEffectService,
   KillingQuestService,
   ManaService,
   MovementQuestService,
   QuestNotifier,
   QuestProgressService,
   SpellAvailabilityService,
} from '../modules';
import { AngleBlastSpellService } from '../modules/FightingModule/services/AngleBlastSpellService';
import { AreaSpellService } from '../modules/FightingModule/services/AreaSpellService';
import { AreaEffectService } from '../modules/FightingModule/services/EffectHandlers/AreaEffectService';
import { GenerateSpellPowerEffectService } from '../modules/FightingModule/services/EffectHandlers/GenerateSpellPowerEffectService';
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
   manaService: ManaService;
   spellAvailabilityService: SpellAvailabilityService;
   directInstantSpellService: DirectInstantSpellService;
   angleBlastSpellService: AngleBlastSpellService;
   areaSpellService: AreaSpellService;
   damageEffectService: DamageEffectService;
   generateSpellPowerEffectService: GenerateSpellPowerEffectService;
   healEffectService: HealEffectService;
   areaEffectService: AreaEffectService;
}
