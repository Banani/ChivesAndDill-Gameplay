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

   it('Other players should also be informed about not their equipment', () => {
      const { players, engineManager } = setupEngine();
      const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfPackageIsValid(GlobalStoreModule.EQUIPMENT, dataPackage, {
         data: {
            playerCharacter_3: {
               back: null,
               chest: null,
               feet: null,
               finger1: null,
               finger2: null,
               hands: null,
               head: null,
               legs: null,
               mainHand: null,
               neck: null,
               offHand: null,
               shirt: null,
               shoulder: null,
               tabard: null,
               trinket1: null,
               trinket2: null,
               waist: null,
               wrist: null,
            },
         },
      });
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

   it('Player should get error if tries to equip item that cannot be equiped', () => {
      const { players, engineManager } = setupEngine();

      engineManager.createSystemAction<GenerateItemForCharacterEvent>({
         type: ItemEngineEvents.GenerateItemForCharacter,
         characterId: players['1'].characterId,
         itemTemplateId: '3',
         amount: 1,
      });

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const itemId = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ItemClientMessages.EquipItem, itemInstanceId: itemId });

      checkIfErrorWasHandled(GlobalStoreModule.EQUIPMENT, 'You cannot equip that.', dataPackage);
   });

   it('Player should be notified when equips the item', () => {
      const { players, engineManager } = setupEngine();

      engineManager.createSystemAction<GenerateItemForCharacterEvent>({
         type: ItemEngineEvents.GenerateItemForCharacter,
         characterId: players['1'].characterId,
         itemTemplateId: '6',
         amount: 1,
      });

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const itemId = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ItemClientMessages.EquipItem, itemInstanceId: itemId });

      checkIfPackageIsValid(GlobalStoreModule.EQUIPMENT, dataPackage, {
         data: {
            playerCharacter_1: { chest: 'ItemInstance_0' },
         },
      });
   });

   it('Player should have item removed from bag when he equips it', () => {
      const { players, engineManager } = setupEngine();

      engineManager.createSystemAction<GenerateItemForCharacterEvent>({
         type: ItemEngineEvents.GenerateItemForCharacter,
         characterId: players['1'].characterId,
         itemTemplateId: '6',
         amount: 1,
      });

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const itemId = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ItemClientMessages.EquipItem, itemInstanceId: itemId });

      checkIfPackageIsValid(GlobalStoreModule.BACKPACK_ITEMS, dataPackage, {
         toDelete: {
            1: { '0': null },
         },
      });
   });

   it('Player should have item replaced if something else is already taking that spot', () => {
      const { players, engineManager } = setupEngine();

      engineManager.createSystemAction<GenerateItemForCharacterEvent>({
         type: ItemEngineEvents.GenerateItemForCharacter,
         characterId: players['1'].characterId,
         itemTemplateId: '6',
         amount: 1,
      });

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const itemId1 = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

      engineManager.createSystemAction<GenerateItemForCharacterEvent>({
         type: ItemEngineEvents.GenerateItemForCharacter,
         characterId: players['1'].characterId,
         itemTemplateId: '6',
         amount: 1,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const itemId2 = dataPackage.backpackItems.data[players['1'].characterId]['1']['1'].itemId;

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ItemClientMessages.EquipItem, itemInstanceId: itemId1 });
      dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ItemClientMessages.EquipItem, itemInstanceId: itemId2 });

      checkIfPackageIsValid(GlobalStoreModule.EQUIPMENT, dataPackage, {
         data: {
            playerCharacter_1: { chest: itemId2 },
         },
      });
      checkIfPackageIsValid(GlobalStoreModule.BACKPACK_ITEMS, dataPackage, {
         data: {
            playerCharacter_1: { '1': { '1': { amount: 1, itemId: itemId1 } } },
         },
      });
   });

   it('Player should get error if tries to strip item that does not exist', () => {
      const { players, engineManager } = setupEngine();

      const dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ItemClientMessages.StripItem, itemInstanceId: 'SOME_RANDOM_ID' });

      checkIfErrorWasHandled(GlobalStoreModule.EQUIPMENT, 'Item does not exist.', dataPackage);
   });

   it('Player should get error if tries to strip item that does not belong to him', () => {
      const { players, engineManager } = setupEngine();

      engineManager.createSystemAction<GenerateItemForCharacterEvent>({
         type: ItemEngineEvents.GenerateItemForCharacter,
         characterId: players['1'].characterId,
         itemTemplateId: '6',
         amount: 1,
      });

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const itemId = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

      dataPackage = engineManager.callPlayerAction(players['2'].socketId, { type: ItemClientMessages.StripItem, itemInstanceId: itemId });

      checkIfErrorWasHandled(GlobalStoreModule.EQUIPMENT, 'Item does not exist.', dataPackage);
   });

   it('Player should get error if tries to strip item that he does not wear', () => {
      const { players, engineManager } = setupEngine();

      engineManager.createSystemAction<GenerateItemForCharacterEvent>({
         type: ItemEngineEvents.GenerateItemForCharacter,
         characterId: players['1'].characterId,
         itemTemplateId: '6',
         amount: 1,
      });

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const itemId = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ItemClientMessages.StripItem, itemInstanceId: itemId });

      checkIfErrorWasHandled(GlobalStoreModule.EQUIPMENT, 'You do not wear that.', dataPackage);
   });

   it('Player should be notified when strips the item', () => {
      const { players, engineManager } = setupEngine();

      engineManager.createSystemAction<GenerateItemForCharacterEvent>({
         type: ItemEngineEvents.GenerateItemForCharacter,
         characterId: players['1'].characterId,
         itemTemplateId: '6',
         amount: 1,
      });

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const itemId = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

      engineManager.callPlayerAction(players['1'].socketId, { type: ItemClientMessages.EquipItem, itemInstanceId: itemId });
      dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ItemClientMessages.StripItem, itemInstanceId: itemId });

      checkIfPackageIsValid(GlobalStoreModule.EQUIPMENT, dataPackage, {
         toDelete: {
            playerCharacter_1: { chest: null },
         },
      });
   });

   it('Player should get item in backpack when strips the item with desired locaion', () => {
      const { players, engineManager } = setupEngine();

      engineManager.createSystemAction<GenerateItemForCharacterEvent>({
         type: ItemEngineEvents.GenerateItemForCharacter,
         characterId: players['1'].characterId,
         itemTemplateId: '6',
         amount: 1,
      });

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const itemId = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

      engineManager.callPlayerAction(players['1'].socketId, { type: ItemClientMessages.EquipItem, itemInstanceId: itemId });
      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: ItemClientMessages.StripItem,
         itemInstanceId: itemId,
         desiredLocation: {
            backpack: '1',
            spot: '3',
         },
      });

      checkIfPackageIsValid(GlobalStoreModule.BACKPACK_ITEMS, dataPackage, {
         data: {
            playerCharacter_1: {
               '1': {
                  '3': {
                     amount: 1,
                     itemId: 'ItemInstance_0',
                  },
               },
            },
         },
      });
   });

   it('Player should get item in backpack when strips the item without desired location', () => {
      const { players, engineManager } = setupEngine();

      engineManager.createSystemAction<GenerateItemForCharacterEvent>({
         type: ItemEngineEvents.GenerateItemForCharacter,
         characterId: players['1'].characterId,
         itemTemplateId: '6',
         amount: 1,
      });

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const itemId = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

      engineManager.callPlayerAction(players['1'].socketId, { type: ItemClientMessages.EquipItem, itemInstanceId: itemId });
      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: ItemClientMessages.StripItem,
         itemInstanceId: itemId,
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
});
