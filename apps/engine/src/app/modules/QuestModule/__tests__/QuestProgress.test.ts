import { CharacterDirection, GlobalStoreModule, QuestType } from '@bananos/types';
import { checkIfPackageIsValid, EngineManager } from 'apps/engine/src/app/testUtilities';
import { Classes } from 'apps/engine/src/app/types/Classes';
import { EngineEvents } from '../../../EngineEvents';
import { CharacterDiedEvent, PlayerMovedEvent } from '../../../types';
import { Monster } from '../../MonsterModule/types';
import { QuestCompletedEvent, QuestEngineEvents, StartQuestEvent } from '../Events';
import { Quests } from '../Quests';
import { QuestTemplateService } from '../services';
import _ = require('lodash');

jest.mock('../services/QuestTemplateService', () => {
   const getData = jest.fn();

   return {
      QuestTemplateService: function () {
         return {
            init: jest.fn(),
            handleEvent: jest.fn(),
            getData,
         };
      },
   };
});

const setupEngine = () => {
   const respawnService = new QuestTemplateService();
   (respawnService.getData as jest.Mock).mockReturnValue(_.cloneDeep(Quests));

   const engineManager = new EngineManager();

   const players = {
      '1': engineManager.preparePlayerWithCharacter({ name: 'character_1', class: Classes.Tank }),
   };

   return { engineManager, players };
};

describe('QuestProgress', () => {
   it('Player should get quest progress when starting new quest', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      engineManager.createSystemAction<StartQuestEvent>({
         type: QuestEngineEvents.StartQuest,
         characterId: players['1'].characterId,
         questId: '1',
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfPackageIsValid(GlobalStoreModule.QUEST_PROGRESS, dataPackage, {
         data: {
            '1': {
               activeStage: '1',
               allStagesCompleted: false,
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

   it('Player should be informed about progress when killing new monster', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      engineManager.createSystemAction<StartQuestEvent>({
         type: QuestEngineEvents.StartQuest,
         characterId: players['1'].characterId,
         questId: '1',
      });

      _.times(2, () => {
         engineManager.createSystemAction<CharacterDiedEvent>({
            type: EngineEvents.CharacterDied,
            characterId: '1',
            character: { division: 'OrcSpearman' } as Monster,
            killerId: players['1'].characterId,
         });
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfPackageIsValid(GlobalStoreModule.QUEST_PROGRESS, dataPackage, {
         data: {
            '1': {
               stagesProgress: {
                  '1': {
                     '2': {
                        currentAmount: 2,
                     },
                  },
               },
            },
         },
      });
   });

   it('Player should not be informed about progress when killing new monster which does not match quest criteria', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      engineManager.createSystemAction<StartQuestEvent>({
         type: QuestEngineEvents.StartQuest,
         characterId: players['1'].characterId,
         questId: '1',
      });

      engineManager.createSystemAction<CharacterDiedEvent>({
         type: EngineEvents.CharacterDied,
         characterId: '1',
         character: { division: 'Different division' } as Monster,
         killerId: players['1'].characterId,
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfPackageIsValid(GlobalStoreModule.QUEST_PROGRESS, dataPackage, undefined);
   });

   it('Player should be informed that quest stage part is done when required amount of characters is killed', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      engineManager.createSystemAction<StartQuestEvent>({
         type: QuestEngineEvents.StartQuest,
         characterId: players['1'].characterId,
         questId: '1',
      });

      _.times(6, () => {
         engineManager.createSystemAction<CharacterDiedEvent>({
            type: EngineEvents.CharacterDied,
            characterId: '1',
            character: { division: 'OrcSpearman' } as Monster,
            killerId: players['1'].characterId,
         });
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfPackageIsValid(GlobalStoreModule.QUEST_PROGRESS, dataPackage, {
         data: { '1': { stagesProgress: { '1': { '2': { currentAmount: 6, isDone: true } } } } },
      });
   });

   it('Player should be informed that quest stage part is done when player moved to required location', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      engineManager.createSystemAction<StartQuestEvent>({
         type: QuestEngineEvents.StartQuest,
         characterId: players['1'].characterId,
         questId: '1',
      });

      engineManager.createSystemAction<PlayerMovedEvent>({
         type: EngineEvents.PlayerMoved,
         characterId: players['1'].characterId,
         newCharacterDirection: CharacterDirection.DOWN,
         newLocation: { x: 175, y: 180 },
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfPackageIsValid(GlobalStoreModule.QUEST_PROGRESS, dataPackage, {
         data: { '1': { stagesProgress: { '1': { '1': { isDone: true } } } } },
      });
   });

   it('Player should not be informed that quest stage part is done when is not close enough', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      engineManager.createSystemAction<StartQuestEvent>({
         type: QuestEngineEvents.StartQuest,
         characterId: players['1'].characterId,
         questId: '1',
      });

      engineManager.createSystemAction<PlayerMovedEvent>({
         type: EngineEvents.PlayerMoved,
         characterId: players['1'].characterId,
         newCharacterDirection: CharacterDirection.DOWN,
         newLocation: { x: 20, y: 10 },
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfPackageIsValid(GlobalStoreModule.QUEST_PROGRESS, dataPackage, undefined);
   });

   it('Player should get new quest part when the previous is done', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      engineManager.createSystemAction<StartQuestEvent>({
         type: QuestEngineEvents.StartQuest,
         characterId: players['1'].characterId,
         questId: '1',
      });

      engineManager.createSystemAction<PlayerMovedEvent>({
         type: EngineEvents.PlayerMoved,
         characterId: players['1'].characterId,
         newCharacterDirection: CharacterDirection.DOWN,
         newLocation: { x: 175, y: 180 },
      });

      _.times(6, () => {
         engineManager.createSystemAction<CharacterDiedEvent>({
            type: EngineEvents.CharacterDied,
            characterId: '1',
            character: { division: 'OrcSpearman' } as Monster,
            killerId: players['1'].characterId,
         });
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfPackageIsValid(GlobalStoreModule.QUEST_PROGRESS, dataPackage, {
         data: {
            '1': {
               activeStage: '2',
               stagesProgress: {
                  '1': {
                     '2': { currentAmount: 6, isDone: true },
                  },
                  '2': {
                     '3': { currentAmount: 0, isDone: false, type: QuestType.KILLING },
                     '4': { currentAmount: 0, isDone: false, type: QuestType.KILLING },
                  },
               },
            },
         },
      });

      checkIfPackageIsValid(GlobalStoreModule.QUEST_DEFINITION, dataPackage, {
         data: {
            '1': {
               stageOrder: ['1'],
               stages: {
                  '2': {
                     description: 'Now it is time to fight',
                     stageParts: {
                        '3': {
                           amount: 6,
                           description: "Kill Orc Spearman's",
                           type: 'killing',
                        },
                        '4': {
                           amount: 12,
                           description: "Kill Orc's",
                           type: 'killing',
                        },
                     },
                  },
               },
            },
         },
      });
   });

   it('Player should get notification that all stages are done when he complete all the stages', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      engineManager.createSystemAction<StartQuestEvent>({
         type: QuestEngineEvents.StartQuest,
         characterId: players['1'].characterId,
         questId: '1',
      });

      engineManager.createSystemAction<PlayerMovedEvent>({
         type: EngineEvents.PlayerMoved,
         characterId: players['1'].characterId,
         newCharacterDirection: CharacterDirection.DOWN,
         newLocation: { x: 175, y: 180 },
      });

      _.times(6, () => {
         engineManager.createSystemAction<CharacterDiedEvent>({
            type: EngineEvents.CharacterDied,
            characterId: '1',
            character: { division: 'OrcSpearman' } as Monster,
            killerId: players['1'].characterId,
         });
      });

      _.times(12, () => {
         engineManager.createSystemAction<CharacterDiedEvent>({
            type: EngineEvents.CharacterDied,
            characterId: '1',
            character: { division: 'Orc' } as Monster,
            killerId: players['1'].characterId,
         });
      });

      _.times(6, () => {
         engineManager.createSystemAction<CharacterDiedEvent>({
            type: EngineEvents.CharacterDied,
            characterId: '1',
            character: { division: 'OrcSpearman' } as Monster,
            killerId: players['1'].characterId,
         });
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfPackageIsValid(GlobalStoreModule.QUEST_PROGRESS, dataPackage, {
         data: {
            '1': {
               allStagesCompleted: true,
               stagesProgress: {
                  '2': {
                     '3': { currentAmount: 6, isDone: true },
                  },
               },
            },
         },
      });
   });

   it('Player should get quest deleted when quest is completed', () => {
      const { players, engineManager } = setupEngine();

      let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      engineManager.createSystemAction<StartQuestEvent>({
         type: QuestEngineEvents.StartQuest,
         characterId: players['1'].characterId,
         questId: '1',
      });

      engineManager.createSystemAction<QuestCompletedEvent>({
         type: QuestEngineEvents.QuestCompleted,
         characterId: players['1'].characterId,
         questId: '1',
      });

      dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

      checkIfPackageIsValid(GlobalStoreModule.QUEST_PROGRESS, dataPackage, {
         toDelete: {
            '1': null,
         },
      });
   });
});