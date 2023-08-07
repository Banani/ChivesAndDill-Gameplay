import { GlobalStoreModule, NpcClientActions } from '@bananos/types';
import { EngineManager, checkIfErrorWasHandled, checkIfPackageIsValid } from 'apps/engine/src/app/testUtilities';
import { WalkingType } from 'apps/engine/src/app/types/CharacterRespawn';
import { MockedItemTemplates, MockedNpcTemplates } from '../../../mocks';
import { GenerateItemForCharacterEvent, ItemEngineEvents } from '../../ItemModule/Events';
import { ItemTemplateService } from '../../ItemModule/services/ItemTemplateService';
import { NpcEngineEvents, NpcRespawnsUpdatedEvent } from '../Events';
import { NpcTemplates } from '../NpcTemplate';
import { NpcRespawnTemplateService } from '../services/NpcRespawnTemplateService';
import { NpcTemplateService } from '../services/NpcTemplateService';
import _ = require('lodash');

const setupEngine = () => {
    const itemTemplateService = new ItemTemplateService();
    (itemTemplateService.getData as jest.Mock).mockReturnValue(MockedItemTemplates)

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
    });

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

describe('SellItemToNpc action', () => {
    it('Player should have item removed from bag when he is selling it', () => {
        const { players, engineManager } = setupEngine();

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const npcId = _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name).id;

        engineManager.createSystemAction<GenerateItemForCharacterEvent>({
            type: ItemEngineEvents.GenerateItemForCharacter,
            characterId: players['1'].characterId,
            itemTemplateId: '3',
            amount: 6,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const itemId = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: NpcClientActions.OpenNpcConversationDialog,
            npcId,
        });

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: NpcClientActions.SellItemToNpc,
            itemId,
            npcId,
        });

        checkIfPackageIsValid(GlobalStoreModule.BACKPACK_ITEMS, dataPackage, {
            toDelete: {
                [players['1'].characterId]: {
                    '1': {
                        '0': null,
                    },
                },
            },
        });
    });

    it('Player should have some money removed when he is buying new item', () => {
        const { players, engineManager } = setupEngine();

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const npcId = _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name).id;

        engineManager.createSystemAction<GenerateItemForCharacterEvent>({
            type: ItemEngineEvents.GenerateItemForCharacter,
            characterId: players['1'].characterId,
            itemTemplateId: '3',
            amount: 6,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const itemId = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: NpcClientActions.OpenNpcConversationDialog,
            npcId,
        });

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: NpcClientActions.SellItemToNpc,
            itemId,
            npcId,
        });

        checkIfPackageIsValid(GlobalStoreModule.CURRENCY, dataPackage, {
            data: {
                playerCharacter_1: 244368,
            },
        });
    });

    it('Player should get an error if tries to sell item to NPC that he is not talking with', () => {
        const { players, engineManager } = setupEngine();

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const npcId = _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name).id;

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: NpcClientActions.SellItemToNpc,
            itemId: '1',
            npcId,
        });

        checkIfErrorWasHandled(GlobalStoreModule.NPC_CONVERSATION, 'You are not talking with that NPC.', dataPackage);
    });

    it('Player should get an error if tries to sell item that he does not have', () => {
        const { players, engineManager } = setupEngine();

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const npcId = _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name).id;

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: NpcClientActions.OpenNpcConversationDialog,
            npcId,
        });

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: NpcClientActions.SellItemToNpc,
            itemId: '1',
            npcId,
        });

        checkIfErrorWasHandled(GlobalStoreModule.NPC_CONVERSATION, 'You do not have that item.', dataPackage);
    });
});
