import { PlayersMovement } from './app/engines';
import { CharactersService, PlayerMovementService, SocketConnectionService, CooldownService } from './app/services';
import { EngineEventCrator } from './app/EngineEventsCreator';
import { CharacterEffectNotifier, PlayerMovementNotifier, ProjectileNotifier } from './app/notifiers';
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
   MonsterAttackEngine,
   MonsterAttackService,
   MonsterNotifier,
   MonsterService,
   RespawnMonsterEngine,
   RespawnService,
} from './app/modules/MonsterModule';
import { ProjectileMovement, AreaEffectsEngine } from './app/modules/FightingModule/engines';
import { AreaEffectService } from './app/modules/FightingModule/services/EffectHandlers/AreaEffectService';
import { GenerateSpellPowerEffectService } from './app/modules/FightingModule/services/EffectHandlers/GenerateSpellPowerEffectService';
import { ChannelService } from './app/modules/FightingModule/services/SpellHandlers/ChannelService';
import { ChannelEngine } from './app/modules/FightingModule/engines/ChannelEngine';

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
const areaEffectsEngine = new AreaEffectsEngine();
const channelEngine = new ChannelEngine();

const fastEngines = [
   playerMovementEngine,
   playerMovementEngine,
   projectileMovement,
   //    monsterAttackEngine,
   areaEffectsEngine,
   channelEngine,
   //    11111111111111111111111111111111111111111111111111111111,
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
};

const engineEventCreator = new EngineEventCrator(services);

setInterval(() => {
   fastEngines.forEach((engine) => engine.doAction());
}, 1000 / 60);

setInterval(() => {
   slowEngines.forEach((engine) => engine.doAction());
}, 1000);
