import { EngineModule } from '../../types/EngineModule';
import {
   CooldownService,
   ManaService,
   SpellAvailabilityService,
   SpellEffectApplierService,
   AbsorbShieldEffectService,
   AreaEffectService,
   DamageEffectService,
   GenerateSpellPowerEffectService,
   HealEffectService,
   PowerStackEffectService,
   TickEffectOverTimeService,
   AngleBlastSpellService,
   AreaSpellService,
   ChannelService,
   DirectInstantSpellService,
   GuidedProjectilesService,
   ProjectilesService,
   TeleportationSpellService,
} from './services';
import {
   AbsorbShieldNotifier,
   AreaTimeEffectNotifier,
   ChannelingNotifier,
   ProjectileNotifier,
   SpellNotifier,
   SpellPowerNotifier,
   TimeEffectNotifier,
} from './notifiers';
import { ProjectileMovement, GuidedProjectileEngine, AreaEffectsEngine, ChannelEngine, TickOverTimeEffectEngine } from './engines';

export interface SpellModuleServices {
   cooldownService: CooldownService;
   manaService: ManaService;
   spellAvailabilityService: SpellAvailabilityService;
   spellEffectApplierService: SpellEffectApplierService;
   absorbShieldEffectService: AbsorbShieldEffectService;
   areaEffectService: AreaEffectService;
   damageEffectService: DamageEffectService;
   generateSpellPowerEffectService: GenerateSpellPowerEffectService;
   healEffectService: HealEffectService;
   powerStackEffectService: PowerStackEffectService;
   tickEffectOverTimeService: TickEffectOverTimeService;
   angleBlastSpellService: AngleBlastSpellService;
   areaSpellService: AreaSpellService;
   channelService: ChannelService;
   directInstantSpellService: DirectInstantSpellService;
   guidedProjectilesService: GuidedProjectilesService;
   projectilesService: ProjectilesService;
   teleportationSpellService: TeleportationSpellService;
}

export const getSpellModule: () => EngineModule<SpellModuleServices> = () => {
   const projectileMovement = new ProjectileMovement();
   const guidedProjectileEngine = new GuidedProjectileEngine();
   const areaEffectsEngine = new AreaEffectsEngine();
   const channelEngine = new ChannelEngine();
   const tickOverTimeEffectEngine = new TickOverTimeEffectEngine();

   return {
      notifiers: [
         new AbsorbShieldNotifier(),
         new AreaTimeEffectNotifier(),
         new ChannelingNotifier(),
         new ProjectileNotifier(),
         new SpellNotifier(),
         new SpellPowerNotifier(),
         new TimeEffectNotifier(),
      ],
      services: {
         cooldownService: new CooldownService(),
         manaService: new ManaService(),
         spellAvailabilityService: new SpellAvailabilityService(),
         spellEffectApplierService: new SpellEffectApplierService(),
         absorbShieldEffectService: new AbsorbShieldEffectService(),
         areaEffectService: new AreaEffectService(areaEffectsEngine),
         damageEffectService: new DamageEffectService(),
         generateSpellPowerEffectService: new GenerateSpellPowerEffectService(),
         healEffectService: new HealEffectService(),
         powerStackEffectService: new PowerStackEffectService(),
         tickEffectOverTimeService: new TickEffectOverTimeService(tickOverTimeEffectEngine),
         angleBlastSpellService: new AngleBlastSpellService(),
         areaSpellService: new AreaSpellService(),
         channelService: new ChannelService(channelEngine),
         directInstantSpellService: new DirectInstantSpellService(),
         guidedProjectilesService: new GuidedProjectilesService(guidedProjectileEngine),
         projectilesService: new ProjectilesService(projectileMovement),
         teleportationSpellService: new TeleportationSpellService(),
      },
      fastEngines: [projectileMovement, guidedProjectileEngine, areaEffectsEngine, channelEngine, tickOverTimeEffectEngine],
   };
};
