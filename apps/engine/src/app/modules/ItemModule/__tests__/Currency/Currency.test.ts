import { GlobalStoreModule } from '@bananos/types';
import { MockedItemTemplates, MockedQuests } from 'apps/engine/src/app/mocks';
import { EngineManager, checkIfPackageIsValid } from 'apps/engine/src/app/testUtilities';
import { QuestCompletedEvent, QuestEngineEvents, StartQuestEvent } from '../../../QuestModule/Events';
import { QuestTemplateService } from '../../../QuestModule/services/QuestTemplateService';
import { ItemTemplateService } from '../../services/ItemTemplateService';
import _ = require('lodash');

const setupEngine = () => {
    const itemTemplateService = new ItemTemplateService();
    (itemTemplateService.getData as jest.Mock).mockReturnValue(MockedItemTemplates)

    const respawnService = new QuestTemplateService();
    (respawnService.getData as jest.Mock).mockReturnValue(MockedQuests);

    const engineManager = new EngineManager();

    const players = {
        '1': engineManager.preparePlayerWithCharacter({ name: 'character_1' }),
        '2': engineManager.preparePlayerWithCharacter({ name: 'character_2' }),
    };

    return { engineManager, players };
};

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
