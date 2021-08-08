import { PathFinderEngine } from '../engines';
import type {
   AngleBlastSpellService,
   AreaSpellService,
   DamageEffectService,
   DirectInstantSpellService,
   HealEffectService,
   KillingQuestService,
   ManaService,
   MovementQuestService,
   ProjectileNotifier,
   ProjectilesService,
   QuestNotifier,
   QuestProgressService,
   SpellAvailabilityService,
   SpellEffectApplierService,
   SpellNotifier,
   TeleportationSpellService,
} from '../modules';
import type { RegenerationService } from '../modules/CharacterModule/services/RegenerationService';
import type { BossFightService, MonsterAttackService, MonsterMovementService, MonsterService, RespawnService } from '../modules/MonsterModule';
import type { MonsterNotifier } from '../modules/MonsterModule/notifiers/MonsterNotifier';
import type { AggroService } from '../modules/MonsterModule/services/aggroService';
import type { PlayerMovementService } from '../modules/PlayerModule';
import type { PlayerMovementNotifier, CharacterEffectNotifier } from '../modules/PlayerModule/notifiers';
import type { CharactersService } from '../modules/PlayerModule/services/CharactersService';
import { ChannelingNotifier } from '../modules/SpellModule/notifiers/ChannelingNotifier';
import type { CooldownService } from '../modules/SpellModule/services/CooldownService';
import type { AbsorbShieldEffectService } from '../modules/SpellModule/services/EffectHandlers/AbsorbShieldEffectService';
import type { AreaEffectService } from '../modules/SpellModule/services/EffectHandlers/AreaEffectService';
import type { GenerateSpellPowerEffectService } from '../modules/SpellModule/services/EffectHandlers/GenerateSpellPowerEffectService';
import type { PowerStackEffectService } from '../modules/SpellModule/services/EffectHandlers/PowerStackEffectService';
import type { TickEffectOverTimeService } from '../modules/SpellModule/services/EffectHandlers/TickEffectOverTimeService';
import type { ChannelService } from '../modules/SpellModule/services/SpellHandlers/ChannelService';
import type { GuidedProjectilesService } from '../modules/SpellModule/services/SpellHandlers/GuidedProjectilesService';
import type { PathFinderService, SocketConnectionService } from '../services';
import type { SchedulerService } from '../services/SchedulerService';

export interface Services {
   pathFinderService: PathFinderService;
   schedulerService: SchedulerService;
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
   channelingNotifier: ChannelingNotifier;
   monsterAttackService: MonsterAttackService;
   monsterNotifier: MonsterNotifier;
   manaService: ManaService;
   spellEffectApplierService: SpellEffectApplierService;
   spellAvailabilityService: SpellAvailabilityService;
   directInstantSpellService: DirectInstantSpellService;
   angleBlastSpellService: AngleBlastSpellService;
   areaSpellService: AreaSpellService;
   damageEffectService: DamageEffectService;
   generateSpellPowerEffectService: GenerateSpellPowerEffectService;
   healEffectService: HealEffectService;
   areaEffectService: AreaEffectService;
   monsterMovementService: MonsterMovementService;
   channelService: ChannelService;
   spellNotifier: SpellNotifier;
   tickEffectOverTimeService: TickEffectOverTimeService;
   bossFightService: BossFightService;
   guidedProjectilesService: GuidedProjectilesService;
   powerStackEffectService: PowerStackEffectService;
   absorbShieldEffectService: AbsorbShieldEffectService;
   teleportationSpellService: TeleportationSpellService;
   regenerationService: RegenerationService;
}
