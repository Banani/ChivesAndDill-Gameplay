import { PlayersMovement } from './app/engines';
import { CharactersService, PlayerMovementService, SocketConnectionService, CooldownService } from './app/services';
import { EngineEventCrator } from './app/EngineEventsCreator';
import { CharacterEffectNotifier, PlayerMovementNotifier, ProjectileNotifier } from './app/notifiers';
import { Services } from './app/types/Services';
import {
   DirectInstantSpellService,
   KillingQuestService,
   MovementQuestService,
   QuestNotifier,
   QuestProgressService,
   SpellAvailabilityService,
} from './app/modules';
import {
   AggroService,
   MonsterAttackEngine,
   MonsterAttackService,
   MonsterNotifier,
   MonsterService,
   RespawnMonsterEngine,
   RespawnService,
} from './app/modules/MonsterModule';
import { DamageEffectService } from './app/modules/FightingModule/services/DamageEffectService';
import { HealEffectService } from './app/modules/FightingModule/services/HealEffectService';
import { ProjectileMovement } from './app/modules/FightingModule/engines';
import { ProjectilesService } from './app/modules/FightingModule/services/ProjectilesService';

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
const respawnMonsterEngine = new RespawnMonsterEngine();
const monsterAttackEngine = new MonsterAttackEngine();

const fastEngines = [playerMovementEngine, playerMovementEngine, projectileMovement, monsterAttackEngine];
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

   spellAvailabilityService: new SpellAvailabilityService(),
   directInstantSpellService: new DirectInstantSpellService(),
   damageEffectService: new DamageEffectService(),
   healEffectService: new HealEffectService(),
};

const engineEventCreator = new EngineEventCrator(services);

setInterval(() => {
   fastEngines.forEach((engine) => engine.doAction());
}, 1000 / 60);

setInterval(() => {
   slowEngines.forEach((engine) => engine.doAction());
}, 1000);
