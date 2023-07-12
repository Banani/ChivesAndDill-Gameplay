import { EngineModule } from '../../types/EngineModule';
import { AreaEffectsEngine, ChannelEngine, GuidedProjectileEngine, ProjectileMovement, TickOverTimeEffectEngine } from './engines';
import {
    AbsorbShieldNotifier,
    AreaTimeEffectNotifier,
    AvailableSpellsNotifier,
    ChannelingNotifier,
    ProjectileNotifier,
    SpellDefinitionNotifier,
    SpellNotifier,
    SpellPowerNotifier,
    TimeEffectNotifier,
} from './notifiers';
import { SpellCastTimeNotifier } from './notifiers/SpellCastTimeNotifier';
import {
    AbsorbShieldEffectService,
    AngleBlastSpellService,
    AreaEffectService,
    AreaSpellService,
    ChannelService,
    CooldownService,
    DamageEffectService,
    DirectInstantSpellService,
    GenerateSpellPowerEffectService,
    GuidedProjectilesService,
    HealEffectService,
    ManaService,
    PowerStackEffectService,
    ProjectilesService,
    SpellAvailabilityService,
    SpellEffectApplierService,
    SpellService,
    TeleportationSpellService,
    TickEffectOverTimeService,
} from './services';

export interface SpellModuleServices {
    spellService: SpellService
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
            new AvailableSpellsNotifier(),
            new SpellDefinitionNotifier(),
            new SpellCastTimeNotifier()
        ],
        services: {
            spellService: new SpellService(),
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
