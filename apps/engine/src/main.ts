import { PlayersMovement } from './app/engines/playersMovement';
import _ from 'lodash';
import {
  CharactersService,
  PlayerMovementService,
  SocketConnectionService,
} from './app/services';
import { EngineEventCrator } from './app/EngineEventsCreator';
import { PlayerMovementNotifier } from './app/notifiers/PlayerMovementNotifier';

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

const engines = [playerMovementEngine];

const services = {
  characterService: new CharactersService(),
  playerMovementService: new PlayerMovementService(playerMovementEngine),
  playerMovementNotifier: new PlayerMovementNotifier(),
  socketConnectionService: new SocketConnectionService(io),
};

const engineEventCreator = new EngineEventCrator(services);

setInterval(() => {
  engines.forEach((engine) => engine.doAction());
}, 1000 / 60);
