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

describe('OpenNpcConversationDialog action', () => {
   it('Player should be able to start conversation', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.OpenNpcConversationDialog,
         npcId: '1',
      });

      checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
         data: { playerCharacter_1: { npcId: '1' } },
      });
   });

   it('Player should get error if he tries to start conversation with npc that does not exist', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.OpenNpcConversationDialog,
         npcId: 'some_random_npc',
      });

      checkIfErrorWasHandled(CURRENT_MODULE, 'That npc does not exist.', dataPackage);
   });
});
