import { GlobalStoreModule, RecursivePartial } from '@bananos/types';
import { checkIfPackageIsValid, EngineManager } from 'apps/engine/src/app/testUtilities';
import { CharacterRespawn, WalkingType } from 'apps/engine/src/app/types/CharacterRespawn';
import { Classes } from 'apps/engine/src/app/types/Classes';
import { merge } from 'lodash';
import { PlayerCharacter } from '../../../types/PlayerCharacter';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import { QuestCompletedEvent, QuestEngineEvents } from '../../QuestModule/Events';
import { Quests } from '../../QuestModule/Quests';
import { NpcTemplate, NpcTemplates } from '../NpcTemplate';
import { NpcRespawnTemplateService } from '../services/NpcRespawnTemplateService';
import { NpcTemplateService } from '../services/NpcTemplateService';
import _ = require('lodash');

jest.mock('../services/NpcRespawnTemplateService', () => {
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

jest.mock('../services/NpcTemplateService', () => {
   const getData = jest.fn();

   return {
      NpcTemplateService: function () {
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
               characterTemplate: {
                  ...NpcTemplates['Manczur'],
                  quests: {
                     '1': Quests['1'],
                  },
               },
               time: 20000,
               walkingType: WalkingType.None,
            },
         },
         npcRespawns
      )
   );

   const npcTemplateService = new NpcTemplateService();
   (npcTemplateService.getData as jest.Mock).mockReturnValue(
      merge(
         {},
         {
            Manczur: {
               ...NpcTemplates['Manczur'],
               quests: {
                  '1': Quests['1'],
               },
            },
         },
         _.mapValues(npcRespawns, (respawn) => respawn.characterTemplate)
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

   it('Player should have quest deleted from npc offer when it is done', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      engineManager.createSystemAction<QuestCompletedEvent>({
         type: QuestEngineEvents.QuestCompleted,
         characterId: players['1'].characterId,
         questId: '1',
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfPackageIsValid(GlobalStoreModule.NPC_QUESTS, dataPackage, {
         toDelete: {
            '1': null,
         },
      });
   });

   it('Player should not be informed about available tests if they are already done', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      engineManager.createSystemAction<QuestCompletedEvent>({
         type: QuestEngineEvents.QuestCompleted,
         characterId: players['1'].characterId,
         questId: '1',
      });

      engineManager.createSystemAction<PlayerCharacterCreatedEvent>({
         type: PlayerEngineEvents.PlayerCharacterCreated,
         playerCharacter: players['1'].character as PlayerCharacter,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfPackageIsValid(GlobalStoreModule.NPC_QUESTS, dataPackage, undefined);
   });

   it('Quest definition should be removed when the quest is completed', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      engineManager.createSystemAction<QuestCompletedEvent>({
         type: QuestEngineEvents.QuestCompleted,
         characterId: players['1'].characterId,
         questId: '1',
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfPackageIsValid(GlobalStoreModule.QUEST_DEFINITION, dataPackage, { toDelete: { '1': null } });
   });
});
