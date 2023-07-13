import { GlobalStoreModule } from '@bananos/types';
import { MockedItemTemplates } from 'apps/engine/src/app/mocks';
import { EngineManager, checkIfPackageIsValid } from '../../../../testUtilities';
import { QuestCompletedEvent, QuestEngineEvents, StartQuestEvent } from '../../../QuestModule/Events';
import { ItemTemplateService } from '../../services/ItemTemplateService';
import _ = require('lodash');

const setupEngine = () => {
    const itemTemplateService = new ItemTemplateService();
    (itemTemplateService.getData as jest.Mock).mockReturnValue(MockedItemTemplates)

    const engineManager = new EngineManager();

    const players = {
        '1': engineManager.preparePlayerWithCharacter({ name: 'character_1' }),
        '2': engineManager.preparePlayerWithCharacter({ name: 'character_2' }),
        '3': engineManager.preparePlayerWithCharacter({ name: 'character_3' }),
    };

    return { engineManager, players };
};

describe('GetItemsFromQuest', () => {
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
