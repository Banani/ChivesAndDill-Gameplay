import { PathFinderEngine } from '../engines';
import {
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
import { RegenerationService } from '../modules/CharacterModule/services/RegenerationService';
import { BossFightService, MonsterAttackService, MonsterMovementService, MonsterService, RespawnService } from '../modules/MonsterModule';
import { MonsterNotifier } from '../modules/MonsterModule/notifiers/MonsterNotifier';
import { AggroService } from '../modules/MonsterModule/services/aggroService';
import { PlayerMovementService } from '../modules/PlayerModule';
import { PlayerMovementNotifier, CharacterEffectNotifier } from '../modules/PlayerModule/notifiers';
import { CharactersService } from '../modules/PlayerModule/services/CharactersService';
import { CooldownService } from '../modules/SpellModule/services/CooldownService';
import { AbsorbShieldEffectService } from '../modules/SpellModule/services/EffectHandlers/AbsorbShieldEffectService';
import { AreaEffectService } from '../modules/SpellModule/services/EffectHandlers/AreaEffectService';
import { GenerateSpellPowerEffectService } from '../modules/SpellModule/services/EffectHandlers/GenerateSpellPowerEffectService';
import { PowerStackEffectService } from '../modules/SpellModule/services/EffectHandlers/PowerStackEffectService';
import { TickEffectOverTimeService } from '../modules/SpellModule/services/EffectHandlers/TickEffectOverTimeService';
import { ChannelService } from '../modules/SpellModule/services/SpellHandlers/ChannelService';
import { GuidedProjectilesService } from '../modules/SpellModule/services/SpellHandlers/GuidedProjectilesService';
import { PathFinderService, SocketConnectionService } from '../services';
import { SchedulerService } from '../services/SchedulerService';

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
