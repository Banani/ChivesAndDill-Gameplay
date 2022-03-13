import { ClientMessages, CommonClientMessages, EnginePackage, EnginePackageEvent } from '@bananos/types';
import { MainEngine } from '../engines/MainEngine';
import {
   getPlayerModule,
   getCharacterModule,
   getQuestModule,
   getMonsterModule,
   getSpellModule,
   getMapModule,
   getNpcModule,
   getItemModule,
   getChatModule,
} from '../modules';
import { Classes } from '../types/Classes';

export class EngineManager {
   private mainEngine;
   private ioHandler = {};
   private watchForErrors = false;

   private playerSocketIdIncrement = 0;
   private playerSockets = {};
   // socketId => action_name = callback
   private playerActionHandlers: Record<string, Partial<Record<ClientMessages, (a?: any) => {}>>> = {};

   constructor({ watchForErrors } = { watchForErrors: false }) {
      this.watchForErrors = watchForErrors;
      this.mainEngine = new MainEngine(
         {
            on: jest.fn().mockImplementation((event, callback) => {
               this.ioHandler[event] = callback;
            }),
         },
         [
            getPlayerModule(),
            getCharacterModule(),
            getQuestModule(),
            getMonsterModule(),
            getSpellModule(),
            getMapModule(),
            getNpcModule(),
            getItemModule(),
            getChatModule(),
         ]
      );
   }

   doEngineAction() {
      this.mainEngine.doActions();
   }

   addNewPlayer(): string {
      if (this.ioHandler['connection']) {
         this.playerSocketIdIncrement++;
         const id = this.playerSocketIdIncrement;

         this.playerActionHandlers[id] = {};
         this.playerSockets[id] = {
            id,
            emit: jest.fn(),
            on: jest.fn().mockImplementation((action, callback) => {
               this.playerActionHandlers[id][action] = callback;
            }),
         };

         this.ioHandler['connection'](this.playerSockets[id]);
         this.doEngineAction();

         return id.toString();
      }

      throw new Error('IO is not ready yet.');
   }

   callPlayerAction(playerId: string, action: EnginePackageEvent) {
      if (!this.playerActionHandlers[playerId]) {
         throw new Error('Unknown playerId: ' + playerId);
      }

      if (!this.playerActionHandlers[playerId][action.type]) {
         throw new Error(`Action: [${action}] is not handled by Engine for playerId: [${playerId}]`);
      }

      this.playerActionHandlers[playerId][action.type](action);
      this.doEngineAction();
      return this.getLatestPlayerDataPackage(playerId);
   }

   preparePlayerWithCharacter(character: { name: string; class: Classes }) {
      const id = this.addNewPlayer();
      this.callPlayerAction(id, { type: CommonClientMessages.CreateCharacter, ...character });
      const dataPackage = this.getLatestPlayerDataPackage(id);
      return { socketId: id, character, characterId: dataPackage.activeCharacter.data.activeCharacterId };
   }

   getLatestPlayerDataPackage(playerId: string): EnginePackage {
      if (!this.playerSockets[playerId]) {
         throw new Error('Unknown playerId: ' + playerId);
      }
      const calls = this.playerSockets[playerId].emit.mock.calls;
      const lastCall: EnginePackage = calls[calls.length - 1][1];

      if (this.watchForErrors) {
         expect(lastCall.errorMessages.events).toStrictEqual([]);
      }

      return lastCall;
   }
}
