import { GlobalStoreModule } from '@bananos/types';
import { checkIfPackageIsValid, EngineManager } from 'apps/engine/src/app/testUtilities';
import { Classes } from 'apps/engine/src/app/types/Classes';
import { QuestCompletedEvent, QuestEngineEvents, StartQuestEvent } from '../../../QuestModule/Events';
import { Quests } from '../../../QuestModule/Quests';
import { QuestTemplateService } from '../../../QuestModule/services/QuestTemplateService';
import _ = require('lodash');

jest.mock('../../../QuestModule/services/QuestTemplateService', () => {
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
   (respawnService.getData as jest.Mock).mockReturnValue(Quests);

   const engineManager = new EngineManager();

   const players = {
      '1': engineManager.preparePlayerWithCharacter({ name: 'character_1', class: Classes.Tank }),
      '2': engineManager.preparePlayerWithCharacter({ name: 'character_2', class: Classes.Tank }),
   };

   return { engineManager, players };
};

jest.mock('../../../MonsterModule/MonsterRespawns', () => ({
   MonsterRespawns: {},
}));

jest.mock('../../../NpcModule/NpcRespawns', () => ({
   NpcRespawns: {},
}));

describe('Currency', () => {
   it('Player should get currency when quest is completed', () => {
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

      checkIfPackageIsValid(GlobalStoreModule.CURRENCY, dataPackage, {
         data: {
            playerCharacter_1: 245447,
         },
      });
   });
});
