import { GlobalStoreModule } from '@bananos/types';
import { checkIfPackageIsValid, EngineManager } from '../../../../testUtilities';
import { Classes } from '../../../../types/Classes';
import { QuestCompletedEvent, QuestEngineEvents, StartQuestEvent } from '../../../QuestModule/Events';
import { Quests } from '../../../QuestModule/Quests';
import { QuestTemplateService } from '../../../QuestModule/services';
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
      '3': engineManager.preparePlayerWithCharacter({ name: 'character_3', class: Classes.Tank }),
   };

   return { engineManager, players };
};

describe('GetItemsFromQuest.test', () => {
   it('Player should get items after completing quest', () => {
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

      checkIfPackageIsValid(GlobalStoreModule.BACKPACK_ITEMS, dataPackage, {
         data: {
            playerCharacter_1: {
               '1': {
                  '0': {
                     amount: 1,
                     itemId: 'ItemInstance_0',
                  },
                  '1': {
                     amount: 5,
                     itemId: 'ItemInstance_1',
                  },
               },
            },
         },
      });
   });
});
