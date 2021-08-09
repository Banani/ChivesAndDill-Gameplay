import { PathFinderService, SocketConnectionService } from './app/services';
import { EngineEventCrator } from './app/EngineEventsCreator';
import { Services } from './app/types/Services';
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
} from './app/modules';
import {
   AggroService,
   BossFightEngine,
   BossFightService,
   MonsterAttackEngine,
   MonsterAttackService,
   MonsterMovementService,
   MonsterNotifier,
   MonsterService,
   RespawnMonsterEngine,
   RespawnService,
} from './app/modules/MonsterModule';
import {
   ProjectileMovement,
   AreaEffectsEngine,
   TickOverTimeEffectEngine,
   ProjectileNotifier,
   TeleportationSpellService,
   AreaTimeEffectNotifier,
} from './app/modules/SpellModule';
import { ChannelEngine } from './app/modules/SpellModule/engines/ChannelEngine';
import { GuidedProjectileEngine } from './app/modules/SpellModule/engines/GuidedProjectileEngine';
import { CooldownService } from './app/modules/SpellModule/services/CooldownService';
import { AbsorbShieldEffectService } from './app/modules/SpellModule/services/EffectHandlers/AbsorbShieldEffectService';
import { AreaEffectService } from './app/modules/SpellModule/services/EffectHandlers/AreaEffectService';
import { GenerateSpellPowerEffectService } from './app/modules/SpellModule/services/EffectHandlers/GenerateSpellPowerEffectService';
import { PowerStackEffectService } from './app/modules/SpellModule/services/EffectHandlers/PowerStackEffectService';
import { TickEffectOverTimeService } from './app/modules/SpellModule/services/EffectHandlers/TickEffectOverTimeService';
import { ChannelService } from './app/modules/SpellModule/services/SpellHandlers/ChannelService';
import { GuidedProjectilesService } from './app/modules/SpellModule/services/SpellHandlers/GuidedProjectilesService';
import { PlayerMovementService, PlayersMovement } from './app/modules/PlayerModule';
import { CharactersService } from './app/modules/PlayerModule/services/CharactersService';
import { CharacterEffectNotifier, PlayerMovementNotifier } from './app/modules/PlayerModule/notifiers';
import { PathFinderEngine } from './app/engines';
import { MonsterMovementEngine } from './app/modules/MonsterModule/engines/MonsterMovementEngine';
import { SchedulerService } from './app/services/SchedulerService';
import { SchedulerEngine } from './app/engines/SchedulerEngine';
import { RegenerationService } from './app/modules/CharacterModule/services/RegenerationService';
import { ChannelingNotifier } from './app/modules/SpellModule/notifiers/ChannelingNotifier';
import { PowerPointsService } from './app/modules/CharacterModule';
import { PowerPointsNotifier } from './app/modules/CharacterModule/notifiers';
import { TimeEffectNotifier } from './app/modules/SpellModule/notifiers/TimeEffectNotifier';

const hostname = '127.0.0.1';
const port = 3000;
const httpServer = require('http').createServer((req, res) => {
   res.statusCode = 200;
   res.setHeader('Content-Type', 'text/plain');
   res.end('Hello World');
});

const io = require('socket.io')(httpServer, {
   cors: {
      origin: 'http://localhost:4200',
   },
});

httpServer.listen(port, hostname, () => {
   console.log(`Server running at http://${hostname}:${port}/`);
});

const pathFinderEngine = new PathFinderEngine();
const schedulerEngine = new SchedulerEngine();
const playerMovementEngine = new PlayersMovement();
const projectileMovement = new ProjectileMovement();
const guidedProjectileEngine = new GuidedProjectileEngine();
const respawnMonsterEngine = new RespawnMonsterEngine();
const monsterAttackEngine = new MonsterAttackEngine();
const areaEffectsEngine = new AreaEffectsEngine();
const channelEngine = new ChannelEngine();
const tickOverTimeEffectEngine = new TickOverTimeEffectEngine();
const monsterMovementEngine = new MonsterMovementEngine();
const bossFightEngine = new BossFightEngine();

const fastEngines = [
   pathFinderEngine,
   playerMovementEngine,
   projectileMovement,
   guidedProjectileEngine,
   monsterAttackEngine,
   areaEffectsEngine,
   channelEngine,
   tickOverTimeEffectEngine,
   monsterMovementEngine,
   bossFightEngine,
   schedulerEngine,
];
const slowEngines = [respawnMonsterEngine];

const playerMovementNotifier = new PlayerMovementNotifier();
const projectileNotifier = new ProjectileNotifier();
const channelingNotifier = new ChannelingNotifier();
const powerPointsNotifier = new PowerPointsNotifier();
const timeEffectNotifier = new TimeEffectNotifier();
const areaTimeEffectNotifier = new AreaTimeEffectNotifier();
const notifiers = [playerMovementNotifier, projectileNotifier, channelingNotifier, powerPointsNotifier, timeEffectNotifier, areaTimeEffectNotifier];

const socketConnectionService = new SocketConnectionService(io, notifiers);

const services: Services = {
   pathFinderService: new PathFinderService(pathFinderEngine),
   schedulerService: new SchedulerService(schedulerEngine),
   characterService: new CharactersService(),
   powerPointsNotifier,
   areaTimeEffectNotifier,
   playerMovementService: new PlayerMovementService(playerMovementEngine),
   projectilesService: new ProjectilesService(projectileMovement),
   playerMovementNotifier,
   projectileNotifier,
   characterEffectNotifier: new CharacterEffectNotifier(),
   cooldownService: new CooldownService(),
   socketConnectionService,
   powerPointsService: new PowerPointsService(),
   channelingNotifier,
   timeEffectNotifier,

   questProgressService: new QuestProgressService(),
   movementQuestService: new MovementQuestService(),
   killingQuestService: new KillingQuestService(),
   questNotifier: new QuestNotifier(),

   monsterService: new MonsterService(),
   respawnService: new RespawnService(respawnMonsterEngine),
   aggroService: new AggroService(),
   monsterAttackService: new MonsterAttackService(monsterAttackEngine),
   monsterMovementService: new MonsterMovementService(monsterMovementEngine),
   monsterNotifier: new MonsterNotifier(),

   manaService: new ManaService(),
   spellAvailabilityService: new SpellAvailabilityService(),
   spellEffectApplierService: new SpellEffectApplierService(),
   directInstantSpellService: new DirectInstantSpellService(),
   angleBlastSpellService: new AngleBlastSpellService(),
   areaSpellService: new AreaSpellService(),
   damageEffectService: new DamageEffectService(),
   healEffectService: new HealEffectService(),
   generateSpellPowerEffectService: new GenerateSpellPowerEffectService(),
   areaEffectService: new AreaEffectService(areaEffectsEngine),
   channelService: new ChannelService(channelEngine),

   spellNotifier: new SpellNotifier(),
   tickEffectOverTimeService: new TickEffectOverTimeService(tickOverTimeEffectEngine),
   bossFightService: new BossFightService(bossFightEngine),
   guidedProjectilesService: new GuidedProjectilesService(guidedProjectileEngine),
   powerStackEffectService: new PowerStackEffectService(),
   absorbShieldEffectService: new AbsorbShieldEffectService(),
   teleportationSpellService: new TeleportationSpellService(),
   regenerationService: new RegenerationService(),
};

const engineEventCreator = new EngineEventCrator(services);

const startTime = Date.now();
let i = 0;
setInterval(() => {
   engineEventCreator.processEvents();
   fastEngines.forEach((engine) => engine.doAction());
   socketConnectionService.sendMessages();
   i++;
   //    console.log(1000 / ((Date.now() - startTime) / i));
}, 1000 / 60);

setInterval(() => {
   slowEngines.forEach((engine) => engine.doAction());
}, 1000);
