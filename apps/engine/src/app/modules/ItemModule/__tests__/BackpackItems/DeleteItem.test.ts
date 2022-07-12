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

describe('DeleteItem', () => {
   it('Player should be able to delete his item', () => {
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

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ItemClientMessages.Deleteitem, itemId });

      checkIfPackageIsValid(CURRENT_MODULE, dataPackage, { toDelete: { '1': { '0': null } } });
   });

   it('Player should get error when tries to delete item that does not exist', () => {
      const { players, engineManager } = setupEngine();

      const dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ItemClientMessages.Deleteitem, itemId: 'SOME_ITEM_ID' });

      checkIfErrorWasHandled(CURRENT_MODULE, 'Item does not exist.', dataPackage);
   });

   it('Player should get error when tries to delete item that does not belong to him', () => {
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

      dataPackage = engineManager.callPlayerAction(players['2'].socketId, { type: ItemClientMessages.Deleteitem, itemId });

      checkIfErrorWasHandled(CURRENT_MODULE, 'Item does not exist.', dataPackage);
   });
});
