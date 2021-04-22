import { PlayersMovement, ProjectileMovement } from './app/engines';
import _ from 'lodash';
import {
  CharactersService,
  PlayerMovementService,
  SocketConnectionService,
  ProjectilesService,
} from './app/services';
import { EngineEventCrator } from './app/EngineEventsCreator';
import { PlayerMovementNotifier, ProjectileNotifier } from './app/notifiers';

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

const engines = [playerMovementEngine, projectileMovement];

const services = {
  characterService: new CharactersService(),
  playerMovementService: new PlayerMovementService(playerMovementEngine),
  projectilesService: new ProjectilesService(projectileMovement),
  playerMovementNotifier: new PlayerMovementNotifier(),
  projectileNotifier: new ProjectileNotifier(),
  socketConnectionService: new SocketConnectionService(io),
};

const engineEventCreator = new EngineEventCrator(services);

setInterval(() => {
  engines.forEach((engine) => engine.doAction());
}, 1000 / 60);
