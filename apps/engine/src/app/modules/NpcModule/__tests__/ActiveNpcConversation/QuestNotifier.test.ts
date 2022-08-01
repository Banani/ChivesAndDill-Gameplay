import { GlobalStoreModule } from '@bananos/types';
import { checkIfPackageIsValid, EngineManager } from 'apps/engine/src/app/testUtilities';
import { CharacterRespawn, WalkingType } from 'apps/engine/src/app/types/CharacterRespawn';
import { Classes } from 'apps/engine/src/app/types/Classes';
import { merge } from 'lodash';
import { RecursivePartial } from '../../../../types';
import { NpcTemplate, NpcTemplates } from '../../NpcTemplate';
import { NpcRespawnTemplateService } from '../../services/NpcRespawnTemplateService';
import _ = require('lodash');

jest.mock('../../services/NpcRespawnTemplateService', () => {
   const getData = jest.fn();

   return {
      NpcRespawnTemplateService: function () {
         return {
            init: jest.fn(),
            handleEvent: jest.fn(),
            getData,
         };
      },
   };
});

const setupEngine = (npcRespawns: RecursivePartial<Record<string, CharacterRespawn<NpcTemplate>>> = {}) => {
   const respawnService = new NpcRespawnTemplateService();
   (respawnService.getData as jest.Mock).mockReturnValue(
      merge(
         {},
         {
            Manczur: {
               id: 'Manczur',
               location: { x: 100, y: 100 },
               characterTemplate: NpcTemplates['Manczur'],
               time: 20000,
               walkingType: WalkingType.None,
            },
         },
         npcRespawns
      )
   );

   const engineManager = new EngineManager();

   const players = {
      '1': engineManager.preparePlayerWithCharacter({ name: 'character_1', class: Classes.Tank }),
   };

   return { engineManager, players };
};

describe('QuestNotifier', () => {
   it('New players should be informed about available tests', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfPackageIsValid(GlobalStoreModule.NPC_QUESTS, dataPackage, {
         data: {
            Manczur: {
               '1': true,
            },
         },
      });
   });
});
