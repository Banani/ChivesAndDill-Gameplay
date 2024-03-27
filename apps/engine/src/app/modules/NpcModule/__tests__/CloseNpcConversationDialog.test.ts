import { GlobalStoreModule, NpcClientActions } from '@bananos/types';
import { EngineManager, checkIfErrorWasHandled, checkIfPackageIsValid } from 'apps/engine/src/app/testUtilities';
import { WalkingType } from 'apps/engine/src/app/types/CharacterRespawn';
import { MockedNpcTemplates } from '../../../mocks';
import { NpcEngineEvents, NpcRespawnsUpdatedEvent } from '../Events';
import { NpcTemplates } from '../NpcTemplate';
import { NpcRespawnTemplateService } from '../services/NpcRespawnTemplateService';
import { NpcTemplateService } from '../services/NpcTemplateService';
import _ = require('lodash');

const CURRENT_MODULE = GlobalStoreModule.NPC_CONVERSATION;

const setupEngine = () => {
    const npcTemplateService = new NpcTemplateService();
    (npcTemplateService.getData as jest.Mock).mockReturnValue(MockedNpcTemplates)

    const respawnService = new NpcRespawnTemplateService();
    (respawnService.getData as jest.Mock).mockReturnValue({
        'respawn_1': {
            id: 'respawn_1',
            location: { x: 100, y: 100 },
            templateId: "1",
            time: 4000,
            walkingType: WalkingType.None,
        },
    })

    const engineManager = new EngineManager();

    const players = {
        '1': engineManager.preparePlayerWithCharacter({ name: 'character_1' }),
    };

    engineManager.createSystemAction<NpcRespawnsUpdatedEvent>({
        type: NpcEngineEvents.NpcRespawnsUpdated,
        respawnIds: ['respawn_1']
    });

    return { engineManager, players };
};

describe('CloseNpcConversationDialog action', () => {
    it('Player should be able to start conversation', () => {
        const { players, engineManager } = setupEngine();

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const npcId = _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name).id;

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: NpcClientActions.OpenNpcConversationDialog,
            npcId,
        });

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: NpcClientActions.CloseNpcConversationDialog
        });

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
            toDelete: { playerCharacter_1: null },
        });
    });

    it('Player should get an error if it tries to close conversation that does not exist', () => {
        const { players, engineManager } = setupEngine();

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: NpcClientActions.CloseNpcConversationDialog
        });

        checkIfErrorWasHandled(CURRENT_MODULE, 'You are not talking with anyone.', dataPackage);
    });
});
