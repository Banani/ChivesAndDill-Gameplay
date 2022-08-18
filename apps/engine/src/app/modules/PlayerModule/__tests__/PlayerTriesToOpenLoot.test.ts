import { CommonClientMessages, GlobalStoreModule, Location, RecursivePartial } from '@bananos/types';
import { checkIfErrorWasHandled, checkIfPackageIsValid, EngineManager } from 'apps/engine/src/app/testUtilities';
import { Classes } from 'apps/engine/src/app/types/Classes';
import {} from '../../';
import { EngineEvents } from '../../../EngineEvents';
import { RandomGeneratorService } from '../../../services/RandomGeneratorService';
import { CharacterDiedEvent, CharacterType } from '../../../types';
import { WalkingType } from '../../../types/CharacterRespawn';
import { CharacterUnion } from '../../../types/CharacterUnion';
import { MonsterRespawnTemplateService } from '../../MonsterModule/dataProviders';
import { MonsterTemplates } from '../../MonsterModule/MonsterTemplates';
import { Monster } from '../../MonsterModule/types';
import _ = require('lodash');

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

interface SetupProps {
   monsterLocation: Location;
}

const setupEngine = (setupProps: RecursivePartial<SetupProps> = {}) => {
   const respawnService = new MonsterRespawnTemplateService();
   (respawnService.getData as jest.Mock).mockReturnValue({
      '2': {
         id: '2',
         location: setupProps.monsterLocation ?? { x: 300, y: 400 },
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
   };

   return { engineManager, players, randomGeneratorService };
};

describe('PlayerTriesToOpenLoot', () => {
   it('Player should be able to open corpse', () => {
      const { engineManager, players } = setupEngine({ monsterLocation: { x: 150, y: 100 } });

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const monster: Monster = _.find(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

      engineManager.createSystemAction<CharacterDiedEvent>({
         type: EngineEvents.CharacterDied,
         characterId: monster.id,
         killerId: players['1'].characterId,
         character: monster,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      engineManager.callPlayerAction(players['1'].socketId, {
         type: CommonClientMessages.OpenLoot,
         corpseId: Object.keys(dataPackage.corpseDrop.data)[0],
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfPackageIsValid(GlobalStoreModule.ACTIVE_LOOT, dataPackage, {
         data: {
            monster_0: {
               coins: 19,
               items: {
                  corpseItemId_1: {
                     amount: 1,
                     itemTemplateId: '1',
                  },
               },
            },
         },
      });
   });

   it('Player should get error if tries to open corpse that does not exist', () => {
      const { engineManager, players } = setupEngine();

      engineManager.callPlayerAction(players['1'].socketId, {
         type: CommonClientMessages.OpenLoot,
         corpseId: 'Some_random_id',
      });

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfErrorWasHandled(GlobalStoreModule.ACTIVE_LOOT, 'This corpse does not exist.', dataPackage);
   });

   it('Player should get error if tries to open corpse that is to far away', () => {
      const { engineManager, players } = setupEngine({ monsterLocation: { x: 500, y: 500 } });

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const monster: Monster = _.find(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

      engineManager.createSystemAction<CharacterDiedEvent>({
         type: EngineEvents.CharacterDied,
         characterId: monster.id,
         killerId: players['1'].characterId,
         character: monster,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      engineManager.callPlayerAction(players['1'].socketId, {
         type: CommonClientMessages.OpenLoot,
         corpseId: Object.keys(dataPackage.corpseDrop.data)[0],
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfErrorWasHandled(GlobalStoreModule.ACTIVE_LOOT, 'This corpse is to far away.', dataPackage);
   });
});
