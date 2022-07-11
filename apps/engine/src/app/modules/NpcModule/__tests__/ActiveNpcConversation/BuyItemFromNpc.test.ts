import { GlobalStoreModule, NpcClientMessages } from '@bananos/types';
import { checkIfErrorWasHandled, checkIfPackageIsValid, EngineManager } from 'apps/engine/src/app/testUtilities';
import { WalkingType } from 'apps/engine/src/app/types/CharacterRespawn';
import { Classes } from 'apps/engine/src/app/types/Classes';
import _ = require('lodash');
import { ItemTemplates } from '../../../ItemModule/ItemTemplates';
import { NpcTemplates } from '../../NpcTemplate';
import { NpcRespawnTemplateService } from '../../services/NpcRespawnTemplateService';

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
         characterTemplate: {
            ...NpcTemplates['Manczur'],
            stock: {
               '1': ItemTemplates['1'],
               '2': ItemTemplates['2'],
               '4': ItemTemplates['4'],
            },
         },
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

describe('BuyItemFromNpc action', () => {
   it('Player should be able to buy item', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const npcId = _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name).id;

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.OpenNpcConversationDialog,
         npcId,
      });

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.BuyItemFromNpc,
         itemTemplateId: '1',
         amount: 1,
         npcId,
      });

      checkIfPackageIsValid(GlobalStoreModule.BACKPACK_ITEMS, dataPackage, {
         data: {
            playerCharacter_1: {
               '1': {
                  '0': {
                     amount: 1,
                     itemId: 'ItemInstance_0',
                  },
               },
            },
         },
      });
   });

   it('item should be place in desired location if it is provided', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const npcId = _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name).id;

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.OpenNpcConversationDialog,
         npcId,
      });

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.BuyItemFromNpc,
         itemTemplateId: '1',
         amount: 1,
         npcId,
         desiredLocation: { backpack: '1', spot: '10' },
      });

      checkIfPackageIsValid(GlobalStoreModule.BACKPACK_ITEMS, dataPackage, {
         data: {
            playerCharacter_1: {
               '1': {
                  '10': {
                     amount: 1,
                     itemId: 'ItemInstance_0',
                  },
               },
            },
         },
      });
   });

   it('Player should get an error if tries to buy item from NPC that he is not talking with', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const npcId = _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name).id;

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.BuyItemFromNpc,
         itemTemplateId: '1',
         amount: 1,
         npcId,
         desiredLocation: { backpack: '1', spot: '10' },
      });

      checkIfErrorWasHandled(GlobalStoreModule.NPC_CONVERSATION, 'You are not talking with that NPC.', dataPackage);
   });
});
