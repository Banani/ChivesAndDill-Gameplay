import { GlobalStoreModule, ItemClientMessages } from '@bananos/types';
import { checkIfPackageIsValid, EngineManager } from 'apps/engine/src/app/testUtilities';
import { Classes } from 'apps/engine/src/app/types/Classes';
import {} from '..';
import { GenerateItemForCharacterEvent, ItemEngineEvents } from '../../ItemModule/Events';
import _ = require('lodash');

const setupEngine = () => {
   const engineManager = new EngineManager();

   const players = {
      '1': engineManager.preparePlayerWithCharacter({ name: 'character_1', class: Classes.Tank }),
   };

   return { engineManager, players };
};

describe('Attributes', () => {
   it('Player should be notified about his character attributes', () => {
      const { engineManager, players } = setupEngine();

      const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfPackageIsValid(GlobalStoreModule.ATTRIBUTES, dataPackage, {
         data: {
            playerCharacter_1: {
               agility: 0,
               armor: 0,
               intelect: 0,
               spirit: 0,
               stamina: 0,
               strength: 0,
            },
         },
      });
   });

   it('Attributes should be updated when character equipes item', () => {
      const { players, engineManager } = setupEngine();

      engineManager.createSystemAction<GenerateItemForCharacterEvent>({
         type: ItemEngineEvents.GenerateItemForCharacter,
         characterId: players['1'].characterId,
         itemTemplateId: '7',
         amount: 1,
      });

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const itemId = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ItemClientMessages.EquipItem, itemInstanceId: itemId });

      checkIfPackageIsValid(GlobalStoreModule.ATTRIBUTES, dataPackage, {
         data: {
            playerCharacter_1: {
               agility: 0,
               armor: 49,
               intelect: 0,
               spirit: 0,
               stamina: 2,
               strength: 3,
            },
         },
      });
   });

   it('Attributes should be combined when character equipes two items', () => {
      const { players, engineManager } = setupEngine();

      engineManager.createSystemAction<GenerateItemForCharacterEvent>({
         type: ItemEngineEvents.GenerateItemForCharacter,
         characterId: players['1'].characterId,
         itemTemplateId: '7',
         amount: 1,
      });

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const itemId1 = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ItemClientMessages.EquipItem, itemInstanceId: itemId1 });

      engineManager.createSystemAction<GenerateItemForCharacterEvent>({
         type: ItemEngineEvents.GenerateItemForCharacter,
         characterId: players['1'].characterId,
         itemTemplateId: '8',
         amount: 1,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const itemId2 = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ItemClientMessages.EquipItem, itemInstanceId: itemId2 });

      checkIfPackageIsValid(GlobalStoreModule.ATTRIBUTES, dataPackage, {
         data: {
            playerCharacter_1: {
               agility: 2,
               armor: 49,
               intelect: 0,
               spirit: 0,
               stamina: 3,
               strength: 3,
            },
         },
      });
   });

   it('Attributes should not be added when item is replaced', () => {
      const { players, engineManager } = setupEngine();

      engineManager.createSystemAction<GenerateItemForCharacterEvent>({
         type: ItemEngineEvents.GenerateItemForCharacter,
         characterId: players['1'].characterId,
         itemTemplateId: '7',
         amount: 1,
      });

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const itemId1 = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ItemClientMessages.EquipItem, itemInstanceId: itemId1 });

      engineManager.createSystemAction<GenerateItemForCharacterEvent>({
         type: ItemEngineEvents.GenerateItemForCharacter,
         characterId: players['1'].characterId,
         itemTemplateId: '7',
         amount: 1,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const itemId2 = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ItemClientMessages.EquipItem, itemInstanceId: itemId2 });

      checkIfPackageIsValid(GlobalStoreModule.ATTRIBUTES, dataPackage, {
         data: {
            playerCharacter_1: {
               agility: 0,
               armor: 49,
               intelect: 0,
               spirit: 0,
               stamina: 2,
               strength: 3,
            },
         },
      });
   });

   it('Attributes should not be recalculated when item is stripped', () => {
      const { players, engineManager } = setupEngine();

      engineManager.createSystemAction<GenerateItemForCharacterEvent>({
         type: ItemEngineEvents.GenerateItemForCharacter,
         characterId: players['1'].characterId,
         itemTemplateId: '7',
         amount: 1,
      });

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const itemId1 = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ItemClientMessages.EquipItem, itemInstanceId: itemId1 });

      engineManager.createSystemAction<GenerateItemForCharacterEvent>({
         type: ItemEngineEvents.GenerateItemForCharacter,
         characterId: players['1'].characterId,
         itemTemplateId: '8',
         amount: 1,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const itemId2 = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ItemClientMessages.EquipItem, itemInstanceId: itemId2 });
      dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ItemClientMessages.StripItem, itemInstanceId: itemId1 });

      checkIfPackageIsValid(GlobalStoreModule.ATTRIBUTES, dataPackage, {
         data: {
            playerCharacter_1: {
               agility: 2,
               armor: 0,
               intelect: 0,
               spirit: 0,
               stamina: 1,
               strength: 0,
            },
         },
      });
   });
});
