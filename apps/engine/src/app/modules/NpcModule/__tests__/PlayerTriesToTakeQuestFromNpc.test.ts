import { GlobalStoreModule, NpcClientMessages, QuestType } from '@bananos/types';
import { checkIfErrorWasHandled, checkIfPackageIsValid, EngineManager } from 'apps/engine/src/app/testUtilities';
import { CharacterRespawn, WalkingType } from 'apps/engine/src/app/types/CharacterRespawn';
import { Classes } from 'apps/engine/src/app/types/Classes';
import { merge } from 'lodash';
import { RecursivePartial } from '../../../types';
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

describe('PlayerTriesToTakeQuestFromNpc action', () => {
   it('Player should be able to start conversation', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const npcId = _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name).id;

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.PlayerTriesToTakeQuestFromNpc,
         npcId,
         questId: Object.keys(NpcTemplates['Manczur'].quests)[0],
      });

      checkIfPackageIsValid(GlobalStoreModule.QUEST_PROGRESS, dataPackage, {
         data: {
            '1': {
               activeStage: '1',
               stagesProgress: {
                  '1': {
                     '1': {
                        isDone: false,
                        type: QuestType.MOVEMENT,
                     },
                     '2': {
                        currentAmount: 0,
                        isDone: false,
                        type: QuestType.KILLING,
                     },
                  },
               },
            },
         },
      });
   });

   it('Player should get error if he tries to start take quest from npc that does not exist', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.PlayerTriesToTakeQuestFromNpc,
         npcId: 'some_random_npc',
         questId: 'random_id',
      });

      checkIfErrorWasHandled(GlobalStoreModule.NPC_QUESTS, 'That npc does not exist.', dataPackage);
   });

   it('Player should get error if he tries to start take quest from npc that is too far away', () => {
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
         type: NpcClientMessages.PlayerTriesToTakeQuestFromNpc,
         npcId,
         questId: 'random_id',
      });

      checkIfErrorWasHandled(GlobalStoreModule.NPC_QUESTS, 'You are too far away.', dataPackage);
   });

   it('Player should get error if he tries to take quest that this npc is not offering', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
      const npcId = _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name).id;

      dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
         type: NpcClientMessages.PlayerTriesToTakeQuestFromNpc,
         npcId,
         questId: 'random_id',
      });

      checkIfErrorWasHandled(GlobalStoreModule.NPC_QUESTS, 'This npc does not have such quest.', dataPackage);
   });
});
