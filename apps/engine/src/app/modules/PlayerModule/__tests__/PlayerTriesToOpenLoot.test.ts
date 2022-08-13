import { CommonClientMessages, GlobalStoreModule } from '@bananos/types';
import { checkIfPackageIsValid, EngineManager } from 'apps/engine/src/app/testUtilities';
import { Classes } from 'apps/engine/src/app/types/Classes';
import {} from '../../';
import { EngineEvents } from '../../../EngineEvents';
import { CharacterDiedEvent, CharacterType } from '../../../types';
import { WalkingType } from '../../../types/CharacterRespawn';
import { CharacterUnion } from '../../../types/CharacterUnion';
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

const setupEngine = () => {
   const respawnService = new MonsterRespawnTemplateService();
   (respawnService.getData as jest.Mock).mockReturnValue({
      '2': {
         id: '2',
         location: { x: 300, y: 400 },
         characterTemplate: MonsterTemplates['Orc'],
         time: 4000,
         walkingType: WalkingType.None,
      },
   });
   const engineManager = new EngineManager();

   const players = {
      '1': engineManager.preparePlayerWithCharacter({ name: 'character_1', class: Classes.Tank }),
   };

   return { engineManager, players };
};

describe('PlayerTriesToOpenLoot', () => {
   it('Player should be able to open corpse', () => {
      const { engineManager, players } = setupEngine();

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
            playerCharacter_1: {
               corpseId: 'monster_0',
               items: {
                  '1': {
                     amount: 9,
                     item: {
                        name: 'money',
                        type: 0,
                     },
                  },
               },
            },
         },
      });
   });
});
