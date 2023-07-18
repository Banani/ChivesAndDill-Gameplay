import request from "request";
import { MainEngine } from './app/engines/MainEngine';
import { getChatModule, getGroupModule, getItemModule, getMapModule, getMonsterModule, getNpcModule, getQuestModule, getSpellModule } from './app/modules';
import { getCharacterModule } from './app/modules/CharacterModule/module';
import { getPlayerModule } from './app/modules/PlayerModule';
import { environment } from './environments/environment';

const hostname = environment.hostname;
const port = 3000;
const httpServer = require('http').createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Access-Control-Allow-Origin', '*');
    const path = req.url.split("path=")[1];

    //TODO: Nie zaciagac tego za kazdym razem, tylko cachowac 
    if (req.url.indexOf("/photo") !== -1) {
        request.get(path).pipe(res)
    }
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
    getGroupModule()
]);
mainEngine.start();
