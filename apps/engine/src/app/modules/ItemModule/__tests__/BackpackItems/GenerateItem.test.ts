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

describe('GenerateItem', () => {
   it('Should inform player about getting new item', () => {
      const { players, engineManager } = setupEngine();
      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      engineManager.createSystemAction<GenerateItemForCharacterEvent>({
         type: ItemEngineEvents.GenerateItemForCharacter,
         characterId: players['1'].characterId,
         itemTemplateId: '1',
         amount: 1,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
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

   it('should return error message if backpack is full', () => {
      const { players, engineManager } = setupEngine();
      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      _.range(0, 17).forEach(() => {
         engineManager.createSystemAction<GenerateItemForCharacterEvent>({
            type: ItemEngineEvents.GenerateItemForCharacter,
            characterId: players['1'].characterId,
            itemTemplateId: '1',
            amount: 1,
         });
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfErrorWasHandled(CURRENT_MODULE, 'Your backpack is full.', dataPackage);
   });

   it('Item should be placed in first empty spot', () => {
      const { players, engineManager } = setupEngine();
      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      engineManager.createSystemAction<GenerateItemForCharacterEvent>({
         type: ItemEngineEvents.GenerateItemForCharacter,
         characterId: players['1'].characterId,
         itemTemplateId: '1',
         amount: 1,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      let itemId = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: ItemClientMessages.MoveItemInBag,
         itemId,
         directionLocation: {
            backpack: '1',
            spot: '2',
         },
      });

      engineManager.createSystemAction<GenerateItemForCharacterEvent>({
         type: ItemEngineEvents.GenerateItemForCharacter,
         characterId: players['1'].characterId,
         itemTemplateId: '1',
         amount: 1,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
         data: {
            playerCharacter_1: {
               '1': {
                  '0': {
                     amount: 1,
                     itemId: 'ItemInstance_1',
                  },
               },
            },
         },
      });
   });

   it('if item does not have stack, then is should be treated as stack size one, and each item should be created as a separate one', () => {
      const { players, engineManager } = setupEngine();
      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      engineManager.createSystemAction<GenerateItemForCharacterEvent>({
         type: ItemEngineEvents.GenerateItemForCharacter,
         characterId: players['1'].characterId,
         itemTemplateId: '1',
         amount: 2,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
         data: {
            playerCharacter_1: {
               '1': {
                  '0': {
                     itemId: 'ItemInstance_0',
                  },
                  '1': {
                     itemId: 'ItemInstance_1',
                  },
               },
            },
         },
      });
   });

   it('Item should be placed in second bag if the first one is already full', () => {});
});
