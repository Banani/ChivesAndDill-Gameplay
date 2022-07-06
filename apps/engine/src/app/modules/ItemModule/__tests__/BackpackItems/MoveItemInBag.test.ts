import { GlobalStoreModule, ItemClientMessages } from '@bananos/types';
import _ = require('lodash');
import { checkIfErrorWasHandled, checkIfPackageIsValid, EngineManager } from '../../../../testUtilities';
import { Classes } from '../../../../types/Classes';
import { GenerateItemForCharacterEvent, ItemEngineEvents } from '../../Events';

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

describe('MoveItemInBag', () => {
   it('Player should be able to move his item', () => {
      const { players, engineManager } = setupEngine();
      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      engineManager.createSystemAction<GenerateItemForCharacterEvent>({
         type: ItemEngineEvents.GenerateItemForCharacter,
         characterId: players['1'].characterId,
         itemTemplateId: '1',
         amount: 1,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const itemId = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: ItemClientMessages.MoveItemInBag,
         itemId,
         directionLocation: {
            backpack: '1',
            spot: '2',
         },
      });

      checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
         data: {
            '1': {
               '2': {
                  itemId: 'ItemInstance_0',
               },
            },
         },
         toDelete: {
            '1': { '0': null },
         },
      });
   });

   it('Player should get an error if it is trying to move item to spot that does not exist', () => {
      const { players, engineManager } = setupEngine();
      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      engineManager.createSystemAction<GenerateItemForCharacterEvent>({
         type: ItemEngineEvents.GenerateItemForCharacter,
         characterId: players['1'].characterId,
         itemTemplateId: '1',
         amount: 1,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const itemId = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: ItemClientMessages.MoveItemInBag,
         itemId,
         directionLocation: {
            backpack: '1',
            spot: '16',
         },
      });

      checkIfErrorWasHandled(CURRENT_MODULE, 'Invalid backpack location.', dataPackage);
   });

   it('Player should get an error if it is trying to move item to bag that does not exist', () => {
      const { players, engineManager } = setupEngine();
      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      engineManager.createSystemAction<GenerateItemForCharacterEvent>({
         type: ItemEngineEvents.GenerateItemForCharacter,
         characterId: players['1'].characterId,
         itemTemplateId: '1',
         amount: 1,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const itemId = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: ItemClientMessages.MoveItemInBag,
         itemId,
         directionLocation: {
            backpack: '2',
            spot: '1',
         },
      });

      checkIfErrorWasHandled(CURRENT_MODULE, 'Invalid backpack location.', dataPackage);
   });

   it('If player will move item to a place in a bag which is already taken by other item, then their places should be switched', () => {
      const { players, engineManager } = setupEngine();
      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      engineManager.createSystemAction<GenerateItemForCharacterEvent>({
         type: ItemEngineEvents.GenerateItemForCharacter,
         characterId: players['1'].characterId,
         itemTemplateId: '1',
         amount: 1,
      });
      engineManager.createSystemAction<GenerateItemForCharacterEvent>({
         type: ItemEngineEvents.GenerateItemForCharacter,
         characterId: players['1'].characterId,
         itemTemplateId: '2',
         amount: 1,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const itemId = dataPackage.backpackItems.data[players['1'].characterId]['1']['1'].itemId;

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: ItemClientMessages.MoveItemInBag,
         itemId,
         directionLocation: {
            backpack: '1',
            spot: '0',
         },
      });

      checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
         data: {
            '1': {
               '0': {
                  itemId: 'ItemInstance_1',
               },
               '1': {
                  itemId: 'ItemInstance_0',
               },
            },
         },
      });
   });
});
