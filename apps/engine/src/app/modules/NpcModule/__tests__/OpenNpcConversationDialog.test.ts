import { GlobalStoreModule, NpcClientMessages, QuestType } from '@bananos/types';
import { checkIfErrorWasHandled, checkIfPackageIsValid, EngineManager } from 'apps/engine/src/app/testUtilities';
import { CharacterRespawn, WalkingType } from 'apps/engine/src/app/types/CharacterRespawn';
import { Classes } from 'apps/engine/src/app/types/Classes';
import { merge } from 'lodash';
import { RecursivePartial } from '../../../types';
import { Quests } from '../../QuestModule/Quests';
import { NpcTemplate, NpcTemplates } from '../NpcTemplate';
import { NpcRespawnTemplateService } from '../services/NpcRespawnTemplateService';
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

const CURRENT_MODULE = GlobalStoreModule.NPC_CONVERSATION;

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

describe('OpenNpcConversationDialog action', () => {
   it('Player should be able to start conversation', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const npcId = _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name).id;

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.OpenNpcConversationDialog,
         npcId,
      });

      checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
         data: { playerCharacter_1: { npcId } },
      });
   });

   it('Player should get error if he tries to start conversation with npc that does not exist', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.OpenNpcConversationDialog,
         npcId: 'some_random_npc',
      });

      checkIfErrorWasHandled(CURRENT_MODULE, 'That npc does not exist.', dataPackage);
   });

   it('Player should get error if he tries to start conversation with npc that is too far away', () => {
      const { players, engineManager } = setupEngine({
         Manczur: {
            id: 'Manczur',
            location: { x: 151, y: 100 },
            characterTemplate: NpcTemplates['Manczur'],
            time: 20000,
            walkingType: WalkingType.None,
         },
      });

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const npcId = _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name).id;

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.OpenNpcConversationDialog,
         npcId,
      });

      checkIfErrorWasHandled(CURRENT_MODULE, 'You are too far away.', dataPackage);
   });

   it('Player should be informed about quests that NPC provides when starting conversation', () => {
      const quests = { '1': Quests['1'] };
      const { players, engineManager } = setupEngine({
         Manczur: {
            characterTemplate: { quests, ...NpcTemplates['Manczur'] },
         },
      });

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const npcId = _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name).id;

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.OpenNpcConversationDialog,
         npcId,
      });

      const quest = Quests['1'];
      checkIfPackageIsValid(GlobalStoreModule.QUEST_DEFINITION, dataPackage, {
         data: {
            '1': {
               name: quest.name,
               description: quest.description,
               stageOrder: [quest.stageOrder[0]],
               stages: {
                  '1': {
                     description: 'Go to Twilight Outpost',
                     stageParts: {
                        '1': {
                           description: 'Go to Twilight Outpost',
                           type: QuestType.MOVEMENT,
                        },
                        '2': {
                           description: "Kill Orc Spearman's",
                           type: QuestType.KILLING,
                           amount: 6,
                        },
                     },
                  },
               },
            },
         },
      });
   });
});
