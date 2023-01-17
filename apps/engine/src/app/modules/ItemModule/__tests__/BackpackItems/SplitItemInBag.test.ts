import { GlobalStoreModule, ItemClientMessages } from '@bananos/types';
import { checkIfErrorWasHandled, checkIfPackageIsValid, EngineManager } from '../../../../testUtilities';
import { Classes } from '../../../../types/Classes';
import { GenerateItemForCharacterEvent, ItemEngineEvents } from '../../Events';
import _ = require('lodash');

const CURRENT_MODULE = GlobalStoreModule.BACKPACK_ITEMS;

const setupEngine = () => {
   const engineManager = new EngineManager();

   const players = {
      '1': engineManager.preparePlayerWithCharacter({ name: 'character_1', class: Classes.Tank }),
      '2': engineManager.preparePlayerWithCharacter({ name: 'character_2', class: Classes.Tank }),
      '3': engineManager.preparePlayerWithCharacter({ name: 'character_3', class: Classes.Tank }),
   };

   return { engineManager, players };
};

describe('SplitItemInBag', () => {
   it('Player should be able to split item in a bag', () => {
      const { players, engineManager } = setupEngine();
      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      engineManager.createSystemAction<GenerateItemForCharacterEvent>({
         type: ItemEngineEvents.GenerateItemForCharacter,
         characterId: players['1'].characterId,
         itemTemplateId: '3',
         amount: 20,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      let itemId = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: ItemClientMessages.SplitItemStackInBag,
         itemId,
         amount: 5,
         directionLocation: { backpack: '1', spot: '1' },
      });

      checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
         data: {
            playerCharacter_1: {
               '1': {
                  '0': {
                     amount: 15,
                  },
                  '1': {
                     itemId: 'ItemInstance_1',
                     amount: 5,
                  },
               },
            },
         },
      });
   });

   it('Player should get error message if tries to split item that he does not have', () => {
      const { players, engineManager } = setupEngine();
      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: ItemClientMessages.SplitItemStackInBag,
         itemId: 'RANDOM_ID',
         amount: 5,
         directionLocation: { backpack: '1', spot: '1' },
      });

      checkIfErrorWasHandled(CURRENT_MODULE, 'You does not have that item.', dataPackage);
   });

   it('Player should get error message if tries to split stack for more parts that he has', () => {
      const { players, engineManager } = setupEngine();
      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      engineManager.createSystemAction<GenerateItemForCharacterEvent>({
         type: ItemEngineEvents.GenerateItemForCharacter,
         characterId: players['1'].characterId,
         itemTemplateId: '3',
         amount: 10,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      let itemId = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: ItemClientMessages.SplitItemStackInBag,
         itemId,
         amount: 15,
         directionLocation: { backpack: '1', spot: '1' },
      });

      checkIfErrorWasHandled(CURRENT_MODULE, 'You does not have that many items.', dataPackage);
   });

   it('if players tries to split all items from stack to another place then the items should be just moved', () => {
      const { players, engineManager } = setupEngine();
      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      engineManager.createSystemAction<GenerateItemForCharacterEvent>({
         type: ItemEngineEvents.GenerateItemForCharacter,
         characterId: players['1'].characterId,
         itemTemplateId: '3',
         amount: 20,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      let itemId = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: ItemClientMessages.SplitItemStackInBag,
         itemId,
         amount: 20,
         directionLocation: { backpack: '1', spot: '1' },
      });

      checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
         data: {
            [players['1'].characterId]: {
               '1': {
                  '1': {
                     itemId: 'ItemInstance_0',
                     amount: 20,
                  },
               },
            },
         },
         toDelete: {
            [players['1'].characterId]: {
               '1': {
                  '0': null,
               },
            },
         },
      });
   });

   it('Player should get error message if tries to split stack to place that is occupied by another item.', () => {
      const { players, engineManager } = setupEngine();
      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      engineManager.createSystemAction<GenerateItemForCharacterEvent>({
         type: ItemEngineEvents.GenerateItemForCharacter,
         characterId: players['1'].characterId,
         itemTemplateId: '3',
         amount: 10,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      let itemId = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

      engineManager.createSystemAction<GenerateItemForCharacterEvent>({
         type: ItemEngineEvents.GenerateItemForCharacter,
         characterId: players['1'].characterId,
         itemTemplateId: '1',
      });

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: ItemClientMessages.SplitItemStackInBag,
         itemId,
         amount: 5,
         directionLocation: { backpack: '1', spot: '1' },
      });

      checkIfErrorWasHandled(CURRENT_MODULE, 'You cannot do that items split.', dataPackage);
   });
});
