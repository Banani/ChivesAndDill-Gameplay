import { GlobalStoreModule, NpcClientMessages } from '@bananos/types';
import { checkIfErrorWasHandled, checkIfPackageIsValid, EngineManager } from 'apps/engine/src/app/testUtilities';
import { Classes } from 'apps/engine/src/app/types/Classes';

const CURRENT_MODULE = GlobalStoreModule.NPC_CONVERSATION;

const setupEngine = () => {
   const engineManager = new EngineManager();

   const players = {
      '1': engineManager.preparePlayerWithCharacter({ name: 'character_1', class: Classes.Tank }),
      '2': engineManager.preparePlayerWithCharacter({ name: 'character_2', class: Classes.Tank }),
      '3': engineManager.preparePlayerWithCharacter({ name: 'character_3', class: Classes.Tank }),
   };

   return { engineManager, players };
};

describe('CloseNpcConversationDialog action', () => {
   it('Player should be able to start conversation', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.OpenNpcConversationDialog,
         npcId: '1',
      });

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.CloseNpcConversationDialog,
         npcId: '1',
      });

      checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
         toDelete: { playerCharacter_1: null },
      });
   });

   it('Player should get an error if it tries to close conversation that does not exist', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.CloseNpcConversationDialog,
         npcId: '1',
      });

      checkIfErrorWasHandled(CURRENT_MODULE, 'You are not talking with anyone.', dataPackage);
   });
});
