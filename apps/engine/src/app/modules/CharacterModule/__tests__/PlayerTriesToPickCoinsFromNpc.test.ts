import { CommonClientMessages, GlobalStoreModule } from '@bananos/types';
import { EngineEvents } from 'apps/engine/src/app/EngineEvents';
import { checkIfErrorWasHandled, checkIfPackageIsValid, EngineManager } from 'apps/engine/src/app/testUtilities';
import { CharacterDiedEvent, CharacterType } from 'apps/engine/src/app/types';
import { WalkingType } from 'apps/engine/src/app/types/CharacterRespawn';
import { CharacterUnion } from 'apps/engine/src/app/types/CharacterUnion';
import { Classes } from 'apps/engine/src/app/types/Classes';
import {} from '..';
import { RandomGeneratorService } from '../../../services/RandomGeneratorService';
import { MonsterRespawnTemplateService } from '../../MonsterModule/dataProviders';
import { MonsterTemplates } from '../../MonsterModule/MonsterTemplates';
import { Monster } from '../../MonsterModule/types';
import _ = require('lodash');

jest.mock('../../MonsterModule/dataProviders/MonsterRespawnTemplateService', () => {
   const getData = jest.fn();

   return {
      MonsterRespawnTemplateService: function () {
         return {
            init: jest.fn(),
            handleEvent: jest.fn(),
            getData,
         };
      },
   };
});

jest.mock('../../../services/RandomGeneratorService', () => {
   const generateNumber = jest.fn();

   return {
      RandomGeneratorService: function () {
         return {
            init: jest.fn(),
            handleEvent: jest.fn(),
            generateNumber,
         };
      },
   };
});

const setupEngine = () => {
   const respawnService = new MonsterRespawnTemplateService();
   (respawnService.getData as jest.Mock).mockReturnValue({
      '2': {
         id: '2',
         location: { x: 150, y: 100 },
         characterTemplate: MonsterTemplates['Orc'],
         time: 4000,
         walkingType: WalkingType.None,
      },
   });

   const randomGeneratorService = new RandomGeneratorService();
   (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(0.64);

   const engineManager = new EngineManager();

   const players = {
      '1': engineManager.preparePlayerWithCharacter({ name: 'character_1', class: Classes.Tank }),
      '2': engineManager.preparePlayerWithCharacter({ name: 'character_2', class: Classes.Tank }),
      '3': engineManager.preparePlayerWithCharacter({ name: 'character_3', class: Classes.Tank }),
   };

   return { engineManager, players, randomGeneratorService };
};

describe('PlayerTriesToPickCoinsFromNpc', () => {
   it('Player should get coins when he is picking it up', () => {
      const { engineManager, players, randomGeneratorService } = setupEngine();
      (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(0.6);

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['3'].socketId);
      const monster: Monster = _.find(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

      engineManager.createSystemAction<CharacterDiedEvent>({
         type: EngineEvents.CharacterDied,
         characterId: monster.id,
         killerId: players['1'].characterId,
         character: monster,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const corpseId = Object.keys(dataPackage.corpseDrop.data)[0];

      engineManager.callPlayerAction(players['1'].socketId, {
         type: CommonClientMessages.OpenLoot,
         corpseId,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const itemId = Object.keys(dataPackage.activeLoot.data[corpseId].items)[0];

      engineManager.callPlayerAction(players['1'].socketId, {
         type: CommonClientMessages.PickCoinsFromCorpse,
         corpseId,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfPackageIsValid(GlobalStoreModule.CURRENCY, dataPackage, {
         data: {
            playerCharacter_1: 243816,
         },
      });
   });

   it('Player should get error if coins are already taken', () => {
      const { engineManager, players, randomGeneratorService } = setupEngine();
      (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(0);

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['3'].socketId);
      const monster: Monster = _.find(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

      engineManager.createSystemAction<CharacterDiedEvent>({
         type: EngineEvents.CharacterDied,
         characterId: monster.id,
         killerId: players['1'].characterId,
         character: monster,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const corpseId = Object.keys(dataPackage.corpseDrop.data)[0];

      engineManager.callPlayerAction(players['1'].socketId, {
         type: CommonClientMessages.OpenLoot,
         corpseId,
      });

      engineManager.callPlayerAction(players['1'].socketId, {
         type: CommonClientMessages.PickCoinsFromCorpse,
         corpseId,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfErrorWasHandled(GlobalStoreModule.BACKPACK_ITEMS, 'This item is already taken.', dataPackage);
   });

   it('Player should get error if tries to pick coins from corpse that is not opened by him', () => {
      const { engineManager, players, randomGeneratorService } = setupEngine();
      (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(0);

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['3'].socketId);
      const monster: Monster = _.find(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

      engineManager.createSystemAction<CharacterDiedEvent>({
         type: EngineEvents.CharacterDied,
         characterId: monster.id,
         killerId: players['1'].characterId,
         character: monster,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const corpseId = Object.keys(dataPackage.corpseDrop.data)[0];

      engineManager.callPlayerAction(players['2'].socketId, {
         type: CommonClientMessages.PickCoinsFromCorpse,
         corpseId,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['2'].socketId);

      checkIfErrorWasHandled(GlobalStoreModule.BACKPACK_ITEMS, 'You cannot take item from corpse that is not opened by you.', dataPackage);
   });

   it('Other players should also get information that this item is no longer available', () => {
      const { engineManager, players, randomGeneratorService } = setupEngine();
      (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(0.5);

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['3'].socketId);
      const monster: Monster = _.find(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

      engineManager.createSystemAction<CharacterDiedEvent>({
         type: EngineEvents.CharacterDied,
         characterId: monster.id,
         killerId: players['1'].characterId,
         character: monster,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const corpseId = Object.keys(dataPackage.corpseDrop.data)[0];

      engineManager.callPlayerAction(players['1'].socketId, {
         type: CommonClientMessages.OpenLoot,
         corpseId,
      });
      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      engineManager.callPlayerAction(players['2'].socketId, {
         type: CommonClientMessages.OpenLoot,
         corpseId,
      });

      engineManager.callPlayerAction(players['1'].socketId, {
         type: CommonClientMessages.PickCoinsFromCorpse,
         corpseId,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['2'].socketId);

      checkIfPackageIsValid(GlobalStoreModule.ACTIVE_LOOT, dataPackage, {
         toDelete: {
            monster_0: {
               coins: null,
            },
         },
      });
   });

   it('Players that do not have corpse opened should not get update about corpse state', () => {
      const { engineManager, players, randomGeneratorService } = setupEngine();
      (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(0);

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['3'].socketId);
      const monster: Monster = _.find(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

      engineManager.createSystemAction<CharacterDiedEvent>({
         type: EngineEvents.CharacterDied,
         characterId: monster.id,
         killerId: players['1'].characterId,
         character: monster,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const corpseId = Object.keys(dataPackage.corpseDrop.data)[0];

      engineManager.callPlayerAction(players['1'].socketId, {
         type: CommonClientMessages.OpenLoot,
         corpseId,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const itemId = Object.keys(dataPackage.activeLoot.data[corpseId].items)[0];

      engineManager.callPlayerAction(players['2'].socketId, {
         type: CommonClientMessages.OpenLoot,
         corpseId,
      });

      engineManager.callPlayerAction(players['1'].socketId, {
         type: CommonClientMessages.PickCoinsFromCorpse,
         corpseId,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['3'].socketId);

      checkIfPackageIsValid(GlobalStoreModule.ACTIVE_LOOT, dataPackage, undefined);
   });
});