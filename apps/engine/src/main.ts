import { getChatModule, getItemModule, getMapModule, getMonsterModule, getNpcModule, getQuestModule, getSpellModule } from './app/modules';
import { getPlayerModule } from './app/modules/PlayerModule';
import { getCharacterModule } from './app/modules/CharacterModule/module';
import * as _ from 'lodash';
import { MainEngine } from './app/engines/MainEngine';

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

const mainEngine = new MainEngine(io, [
   getPlayerModule(),
   getCharacterModule(),
   getQuestModule(),
   getMonsterModule(),
   getSpellModule(),
   getMapModule(),
   getNpcModule(),
   getItemModule(),
   getChatModule(),
]);
mainEngine.start();
