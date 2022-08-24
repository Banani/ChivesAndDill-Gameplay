import { GlobalStoreModule, RecursivePartial } from '@bananos/types';
import { EngineEvents } from 'apps/engine/src/app/EngineEvents';
import { checkIfPackageIsValid, EngineManager } from 'apps/engine/src/app/testUtilities';
import { CharacterDiedEvent, CharacterType } from 'apps/engine/src/app/types';
import { CharacterRespawn, WalkingType } from 'apps/engine/src/app/types/CharacterRespawn';
import { CharacterUnion } from 'apps/engine/src/app/types/CharacterUnion';
import { Classes } from 'apps/engine/src/app/types/Classes';
import { merge, now } from 'lodash';
import {} from '../..';
import { RandomGeneratorService } from '../../../services/RandomGeneratorService';
import { MonsterRespawnTemplateService } from '../../MonsterModule/dataProviders';
import { MonsterTemplate, MonsterTemplates } from '../../MonsterModule/MonsterTemplates';
import { Monster } from '../../MonsterModule/types';
import _ = require('lodash');

jest.mock('lodash', () => ({
   ...(jest.requireActual('lodash') as any),
   now: jest.fn(),
}));

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

interface CharacterQuotesProps {
   respawnServiceProps?: Record<string, CharacterRespawn<MonsterTemplate>>;
}

const setupEngine = ({ respawnServiceProps }: RecursivePartial<CharacterQuotesProps> = {}) => {
   const respawnService = new MonsterRespawnTemplateService();
   (respawnService.getData as jest.Mock).mockReturnValue(
      merge(
         {
            '2': {
               id: '2',
               location: { x: 150, y: 100 },
               characterTemplate: MonsterTemplates['Orc'],
               time: 4000,
               walkingType: WalkingType.None,
            },
         },
         respawnServiceProps
      )
   );

   const currentTime = '12221';
   (now as jest.Mock).mockReturnValue(currentTime);

   const randomGeneratorService = new RandomGeneratorService();
   (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(0.64);

   const engineManager = new EngineManager();

   const players = {
      '1': engineManager.preparePlayerWithCharacter({ name: 'character_1', class: Classes.Tank }),
   };

   return { engineManager, players, randomGeneratorService, currentTime };
};

describe('CharacterQuotes', () => {
   it('Monster should say a quote, if random number is high enough', () => {
      const { engineManager, players, randomGeneratorService, currentTime } = setupEngine();
      (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(0.7);

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const monster: Monster = _.find(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

      engineManager.createSystemAction<CharacterDiedEvent>({
         type: EngineEvents.CharacterDied,
         characterId: monster.id,
         killerId: players['1'].characterId,
         character: monster,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfPackageIsValid(GlobalStoreModule.CHAT_MESSAGES, dataPackage, {
         data: {
            chatQuoteMessage_0: {
               authorId: 'monster_0',
               channelType: 'Quotes',
               id: 'chatQuoteMessage_0',
               message: 'Agrrrr...',
               time: currentTime,
            },
         },
      });
   });

   it('Monster should not say anything, if random number is not high enough', () => {
      const { engineManager, players, randomGeneratorService } = setupEngine();
      (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(0.3);

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const monster: Monster = _.find(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

      engineManager.createSystemAction<CharacterDiedEvent>({
         type: EngineEvents.CharacterDied,
         characterId: monster.id,
         killerId: players['1'].characterId,
         character: monster,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfPackageIsValid(GlobalStoreModule.CHAT_MESSAGES, dataPackage, undefined);
   });

   it('Monster should not say anything, if monster does not have defined quotes', () => {
      const { engineManager, players, randomGeneratorService } = setupEngine({
         respawnServiceProps: {
            '2': {
               characterTemplate: {
                  quotesEvents: { onDying: null },
               },
            },
         },
      });
      (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(0.8);

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const monster: Monster = _.find(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

      engineManager.createSystemAction<CharacterDiedEvent>({
         type: EngineEvents.CharacterDied,
         characterId: monster.id,
         killerId: players['1'].characterId,
         character: monster,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfPackageIsValid(GlobalStoreModule.CHAT_MESSAGES, dataPackage, undefined);
   });
});
