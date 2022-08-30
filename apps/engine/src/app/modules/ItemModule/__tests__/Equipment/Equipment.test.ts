import { GlobalStoreModule, ItemClientMessages } from '@bananos/types';
import { checkIfErrorWasHandled, checkIfPackageIsValid, EngineManager } from '../../../../testUtilities';
import { Classes } from '../../../../types/Classes';
import { GenerateItemForCharacterEvent, ItemEngineEvents } from '../../Events';

const setupEngine = () => {
   const engineManager = new EngineManager();

   const players = {
      '1': engineManager.preparePlayerWithCharacter({ name: 'character_1', class: Classes.Tank }),
      '2': engineManager.preparePlayerWithCharacter({ name: 'character_2', class: Classes.Tank }),
      '3': engineManager.preparePlayerWithCharacter({ name: 'character_3', class: Classes.Tank }),
   };

   return { engineManager, players };
};

describe('Equipment', () => {
   it('Player should get information about his equipment', () => {
      const { players, engineManager } = setupEngine();

      const dataPackage = engineManager.getLatestPlayerDataPackage(players['3'].socketId);

      checkIfPackageIsValid(GlobalStoreModule.EQUIPMENT, dataPackage, {
         data: {
            playerCharacter_3: {
               head: null,
               neck: null,
               shoulder: null,
               back: null,
               chest: null,
               shirt: null,
               tabard: null,
               wrist: null,

               hands: null,
               waist: null,
               legs: null,
               feet: null,
               finger1: null,
               finger2: null,
               trinket1: null,
               trinket2: null,

               mainHand: null,
               offHand: null,
            },
         },
      });
   });

   it('Other players should not get information about not their equipment', () => {
      const { players, engineManager } = setupEngine();
      const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfPackageIsValid(GlobalStoreModule.EQUIPMENT, dataPackage, undefined);
   });

   it('Player should get error if tries to equip item that he does not have', () => {
      const { players, engineManager } = setupEngine();

      const dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ItemClientMessages.EquipItem, itemInstanceId: 'SOME_ITEM_ID' });

      checkIfErrorWasHandled(GlobalStoreModule.EQUIPMENT, 'Item does not exist.', dataPackage);
   });

   it('Player should get error if tries to equip item that does not belong to him', () => {
      const { players, engineManager } = setupEngine();

      engineManager.createSystemAction<GenerateItemForCharacterEvent>({
         type: ItemEngineEvents.GenerateItemForCharacter,
         characterId: players['1'].characterId,
         itemTemplateId: '1',
         amount: 1,
      });

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const itemId = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

      dataPackage = engineManager.callPlayerAction(players['2'].socketId, { type: ItemClientMessages.EquipItem, itemInstanceId: itemId });

      checkIfErrorWasHandled(GlobalStoreModule.EQUIPMENT, 'Item does not exist.', dataPackage);
   });
});
