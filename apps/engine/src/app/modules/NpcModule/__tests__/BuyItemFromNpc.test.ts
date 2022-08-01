import { GlobalStoreModule, NpcClientMessages } from '@bananos/types';
import { checkIfErrorWasHandled, checkIfPackageIsValid, EngineManager } from 'apps/engine/src/app/testUtilities';
import { WalkingType } from 'apps/engine/src/app/types/CharacterRespawn';
import { Classes } from 'apps/engine/src/app/types/Classes';
import { GenerateItemForCharacterEvent, ItemEngineEvents } from '../../ItemModule/Events';
import { ItemTemplates } from '../../ItemModule/ItemTemplates';
import { NpcTemplates } from '../NpcTemplate';
import { NpcRespawnTemplateService } from '../services/NpcRespawnTemplateService';
import _ = require('lodash');

jest.mock('../services/NpcRespawnTemplateService', () => {
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

   it('Player should have some money removed when he is buying new item', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const npcId = _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name).id;

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.OpenNpcConversationDialog,
         npcId,
      });

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.BuyItemFromNpc,
         itemTemplateId: '4',
         amount: 3,
         npcId,
      });

      checkIfPackageIsValid(GlobalStoreModule.CURRENCY, dataPackage, {
         data: {
            playerCharacter_1: 243423,
         },
      });
   });

   it('Player should get error if he is trying to but item that cost to much', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const npcId = _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name).id;

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.OpenNpcConversationDialog,
         npcId,
      });

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.BuyItemFromNpc,
         itemTemplateId: '5',
         amount: 3,
         npcId,
      });

      checkIfErrorWasHandled(GlobalStoreModule.NPC_CONVERSATION, 'You do not have enough money.', dataPackage);
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

   it('Player should get error if tries to buy item that this npc is not selling', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const npcId = _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name).id;

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.OpenNpcConversationDialog,
         npcId,
      });

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.BuyItemFromNpc,
         itemTemplateId: 'some_random_id',
         amount: 1,
         npcId,
      });

      checkIfErrorWasHandled(GlobalStoreModule.NPC_CONVERSATION, 'This npc is not selling that item.', dataPackage);
   });

   it('Player should get error if tries to buy item, but do not have empty slot in bag', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const npcId = _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name).id;

      _.range(0, 16).forEach(() => {
         engineManager.createSystemAction<GenerateItemForCharacterEvent>({
            type: ItemEngineEvents.GenerateItemForCharacter,
            characterId: players['1'].characterId,
            itemTemplateId: '1',
            amount: 1,
         });
      });

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

      checkIfErrorWasHandled(GlobalStoreModule.NPC_CONVERSATION, 'You do not have enough space in your backpack.', dataPackage);
   });

   it('Player should have items placed in the last stack if he has place only there', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const npcId = _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name).id;

      _.range(0, 16).forEach(() => {
         engineManager.createSystemAction<GenerateItemForCharacterEvent>({
            type: ItemEngineEvents.GenerateItemForCharacter,
            characterId: players['1'].characterId,
            itemTemplateId: '4',
            amount: 19,
         });
      });

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.OpenNpcConversationDialog,
         npcId,
      });

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.BuyItemFromNpc,
         itemTemplateId: '4',
         amount: 1,
         npcId,
      });

      checkIfPackageIsValid(GlobalStoreModule.BACKPACK_ITEMS, dataPackage, {
         data: {
            playerCharacter_1: {
               '1': {
                  '15': {
                     amount: 5,
                  },
               },
            },
         },
      });
   });
});
