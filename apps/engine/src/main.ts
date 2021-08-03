import { SocketConnectionService } from './app/services';
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
   MonsterNotifier,
   MonsterService,
   RespawnMonsterEngine,
   RespawnService,
} from './app/modules/MonsterModule';
import { ProjectileMovement, AreaEffectsEngine, TickOverTimeEffectEngine, ProjectileNotifier, TeleportationSpellService } from './app/modules/SpellModule';
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

const playerMovementEngine = new PlayersMovement();
const projectileMovement = new ProjectileMovement();
const guidedProjectileEngine = new GuidedProjectileEngine();
const respawnMonsterEngine = new RespawnMonsterEngine();
const monsterAttackEngine = new MonsterAttackEngine();
const areaEffectsEngine = new AreaEffectsEngine();
const channelEngine = new ChannelEngine();
const tickOverTimeEffectEngine = new TickOverTimeEffectEngine();
const bossFightEngine = new BossFightEngine();

const fastEngines = [
   playerMovementEngine,
   projectileMovement,
   guidedProjectileEngine,
   monsterAttackEngine,
   areaEffectsEngine,
   channelEngine,
   tickOverTimeEffectEngine,
   bossFightEngine,
];
const slowEngines = [respawnMonsterEngine];

const services: Services = {
   characterService: new CharactersService(),
   playerMovementService: new PlayerMovementService(playerMovementEngine),
   projectilesService: new ProjectilesService(projectileMovement),
   playerMovementNotifier: new PlayerMovementNotifier(),
   projectileNotifier: new ProjectileNotifier(),
   characterEffectNotifier: new CharacterEffectNotifier(),
   cooldownService: new CooldownService(),
   socketConnectionService: new SocketConnectionService(io),

   questProgressService: new QuestProgressService(),
   movementQuestService: new MovementQuestService(),
   killingQuestService: new KillingQuestService(),
   questNotifier: new QuestNotifier(),

   monsterService: new MonsterService(),
   respawnService: new RespawnService(respawnMonsterEngine),
   aggroService: new AggroService(),
   monsterAttackService: new MonsterAttackService(monsterAttackEngine),
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
};

const engineEventCreator = new EngineEventCrator(services);

const startTime = Date.now();
let i = 0;
setInterval(() => {
   engineEventCreator.processEvents();
   fastEngines.forEach((engine) => engine.doAction());
   i++;
   //    console.log(1000 / ((Date.now() - startTime) / i));
}, 1000 / 60);

setInterval(() => {
   slowEngines.forEach((engine) => engine.doAction());
}, 1000);
