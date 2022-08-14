import { CommonClientMessages, GlobalStoreModule } from '@bananos/types';
import { EngineEvents } from 'apps/engine/src/app/EngineEvents';
import { checkIfPackageIsValid, EngineManager } from 'apps/engine/src/app/testUtilities';
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

describe('PlayerTriesToPickItemFromNpc', () => {
   it('Corpse should be removed when everything is collected from it and available corpse drop should be removed', () => {
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

      const itemId1 = Object.keys(dataPackage.activeLoot.data[corpseId].items)[0];

      engineManager.callPlayerAction(players['2'].socketId, {
         type: CommonClientMessages.OpenLoot,
         corpseId,
      });

      engineManager.callPlayerAction(players['1'].socketId, {
         type: CommonClientMessages.PickItemFromCorpse,
         corpseId,
         itemId: itemId1,
      });

      engineManager.callPlayerAction(players['1'].socketId, {
         type: CommonClientMessages.PickCoinsFromCorpse,
         corpseId,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['2'].socketId);

      checkIfPackageIsValid(GlobalStoreModule.ACTIVE_LOOT, dataPackage, { toDelete: { monster_0: null } });
      checkIfPackageIsValid(GlobalStoreModule.CORPSE_DROP, dataPackage, { toDelete: { monster_0: null } });
   });
});
