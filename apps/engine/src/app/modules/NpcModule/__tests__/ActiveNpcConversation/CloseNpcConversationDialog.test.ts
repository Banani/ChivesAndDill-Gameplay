import { GlobalStoreModule, NpcClientMessages } from '@bananos/types';
import { checkIfErrorWasHandled, checkIfPackageIsValid, EngineManager } from 'apps/engine/src/app/testUtilities';
import { WalkingType } from 'apps/engine/src/app/types/CharacterRespawn';
import { Classes } from 'apps/engine/src/app/types/Classes';
import _ = require('lodash');
import { NpcTemplates } from '../../NpcTemplate';
import { NpcRespawnTemplateService } from '../../services/NpcRespawnTemplateService';

const CURRENT_MODULE = GlobalStoreModule.NPC_CONVERSATION;

jest.mock('../../services/NpcRespawnTemplateService', () => {
   const getData = jest.fn();

   return {
      NpcRespawnTemplateService: function () {
         return {
            init: jest.fn(),
            handleEvent: jest.fn(),
            getData,
         };
      },
   };
});

const setupEngine = () => {
   const respawnService = new NpcRespawnTemplateService();
   (respawnService.getData as jest.Mock).mockReturnValue({
      Manczur: {
         id: 'Manczur',
         location: { x: 100, y: 100 },
         characterTemplate: NpcTemplates['Manczur'],
         time: 20000,
         walkingType: WalkingType.None,
      },
   });

   const engineManager = new EngineManager();

   const players = {
      '1': engineManager.preparePlayerWithCharacter({ name: 'character_1', class: Classes.Tank }),
   };

   return { engineManager, players };
};

describe('CloseNpcConversationDialog action', () => {
   it('Player should be able to start conversation', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const npcId = _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name).id;

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.OpenNpcConversationDialog,
         npcId,
      });

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.CloseNpcConversationDialog,
         npcId,
      });

      checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
         toDelete: { playerCharacter_1: null },
      });
   });

   it('Player should get an error if it tries to close conversation that does not exist', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const npcId = _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name).id;

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.CloseNpcConversationDialog,
         npcId,
      });

      checkIfErrorWasHandled(CURRENT_MODULE, 'You are not talking with anyone.', dataPackage);
   });
});
