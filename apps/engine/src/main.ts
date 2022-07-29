import { getChatModule, getItemModule, getMapModule, getMonsterModule, getNpcModule, getQuestModule, getSpellModule } from './app/modules';
import { getPlayerModule } from './app/modules/PlayerModule';
import { getCharacterModule } from './app/modules/CharacterModule/module';
import * as _ from 'lodash';
import { MainEngine } from './app/engines/MainEngine';
import { environment } from './environments/environment.prod';

const hostname = environment.hostname;
const port = 3000;
const httpServer = require('http').createServer((req, res) => {
   res.statusCode = 200;
   res.setHeader('Content-Type', 'text/plain');
   res.end('Hello World');
});

const io = require('socket.io')(httpServer, {
   cors: {
      origin: environment.origin,
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
