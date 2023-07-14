import { GlobalStoreModule } from '@bananos/types';
import { EngineManager, checkIfPackageIsValid } from 'apps/engine/src/app/testUtilities';
import { WalkingType } from 'apps/engine/src/app/types/CharacterRespawn';
import { MockedNpcTemplates } from '../../../mocks';
import { PlayerCharacter } from '../../../types/PlayerCharacter';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import { QuestCompletedEvent, QuestEngineEvents } from '../../QuestModule/Events';
import { NpcEngineEvents, NpcRespawnsUpdatedEvent } from '../Events';
import { NpcRespawnTemplateService } from '../services/NpcRespawnTemplateService';
import { NpcTemplateService } from '../services/NpcTemplateService';
import _ = require('lodash');

const setupEngine = () => {
    const npcTemplateService = new NpcTemplateService();
    (npcTemplateService.getData as jest.Mock).mockReturnValue(MockedNpcTemplates)

    const respawnService = new NpcRespawnTemplateService();
    (respawnService.getData as jest.Mock).mockReturnValue({
        'respawn_1': {
            id: 'respawn_1',
            location: { x: 100, y: 100 },
            characterTemplateId: "1",
            time: 4000,
            walkingType: WalkingType.None,
        },
    });

    const engineManager = new EngineManager();

    const players = {
        '1': engineManager.preparePlayerWithCharacter({ name: 'character_1' }),
    };

    let initDataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

    engineManager.createSystemAction<NpcRespawnsUpdatedEvent>({
        type: NpcEngineEvents.NpcRespawnsUpdated,
        respawnIds: ['respawn_1']
    });

    return { engineManager, players, initDataPackage };
};

describe('QuestNotifier', () => {
    it('New players should be informed about available tests', () => {
        const { players, engineManager, initDataPackage } = setupEngine();

        checkIfPackageIsValid(GlobalStoreModule.NPC_QUESTS, initDataPackage, {
            data: {
                '1': {
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
