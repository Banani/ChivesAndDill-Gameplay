import { GlobalStoreModule, NpcClientActions } from '@bananos/types';
import { EngineManager, checkIfPackageIsValid } from 'apps/engine/src/app/testUtilities';
import { WalkingType } from 'apps/engine/src/app/types/CharacterRespawn';
import { MockedNpcTemplates } from '../../../mocks';
import { NpcEngineEvents, NpcRespawnsUpdatedEvent } from '../Events';
import { NpcTemplates } from '../NpcTemplate';
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

const CURRENT_MODULE = GlobalStoreModule.NPC_STOCK;

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
        }, 'respawn_2': {
            id: 'respawn_2',
            location: { x: 80, y: 100 },
            templateId: "2",
            time: 4000,
            walkingType: WalkingType.None,
        },
    });

    const engineManager = new EngineManager();

    const players = {
        '1': engineManager.preparePlayerWithCharacter({ name: 'character_1' }),
    };

    engineManager.createSystemAction<NpcRespawnsUpdatedEvent>({
        type: NpcEngineEvents.NpcRespawnsUpdated,
        respawnIds: ['respawn_1', 'respawn_2']
    });

    const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
    const npcs = {
        Manczur: _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name),
        KretonPL: _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['KretonPL'].name),
    };

    return { engineManager, players, npcs };
};

describe('Npc Stock', () => {
    it('Player should be notifier about items that this npc is selling, when starting conversation', () => {
        const { players, engineManager, npcs } = setupEngine();

        let dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: NpcClientActions.OpenNpcConversationDialog,
            npcId: npcs['Manczur'].id,
        });

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
            data: {
                [npcs['Manczur'].id]: {
                    '1': true,
                    '2': true,
                    '4': true,
                    '5': true,
                    '3': true,
                    '6': true,
                    '7': true,
                    '8': true,
                    '9': true,
                    '10': true,
                    '11': true,
                    '12': true,
                    '13': true,
                    '14': true,
                }
            },
        });
    });

    it('Player should not be notified about items when npc has nothing to sell', () => {
        const { players, engineManager, npcs } = setupEngine();

        let dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: NpcClientActions.OpenNpcConversationDialog,
            npcId: npcs['KretonPL'].id,
        });

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, undefined);
    });
});
