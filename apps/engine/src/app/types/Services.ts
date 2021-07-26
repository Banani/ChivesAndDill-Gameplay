import {
   AngleBlastSpellService,
   AreaSpellService,
   DamageEffectService,
   DirectInstantSpellService,
   HealEffectService,
   KillingQuestService,
   ManaService,
   MovementQuestService,
   ProjectilesService,
   QuestNotifier,
   QuestProgressService,
   SpellAvailabilityService,
   SpellEffectApplierService,
   SpellNotifier,
} from '../modules';
import { AreaEffectService } from '../modules/FightingModule/services/EffectHandlers/AreaEffectService';
import { GenerateSpellPowerEffectService } from '../modules/FightingModule/services/EffectHandlers/GenerateSpellPowerEffectService';
import { TickEffectOverTimeService } from '../modules/FightingModule/services/EffectHandlers/TickEffectOverTimeService';
import { ChannelService } from '../modules/FightingModule/services/SpellHandlers/ChannelService';
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
   spellEffectApplierService: SpellEffectApplierService;
   spellAvailabilityService: SpellAvailabilityService;
   directInstantSpellService: DirectInstantSpellService;
   angleBlastSpellService: AngleBlastSpellService;
   areaSpellService: AreaSpellService;
   damageEffectService: DamageEffectService;
   generateSpellPowerEffectService: GenerateSpellPowerEffectService;
   healEffectService: HealEffectService;
   areaEffectService: AreaEffectService;
   channelService: ChannelService;
   spellNotifier: SpellNotifier;
   tickEffectOverTimeService: TickEffectOverTimeService;
}
