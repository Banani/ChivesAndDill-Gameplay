import { GlobalStoreModule, Location, NpcClientActions, RecursivePartial } from '@bananos/types';
import { EngineManager, checkIfErrorWasHandled } from 'apps/engine/src/app/testUtilities';
import { WalkingType } from 'apps/engine/src/app/types/CharacterRespawn';
import { MockedNpcTemplates } from '../../../mocks';
import { NpcEngineEvents, NpcRespawnsUpdatedEvent } from '../Events';
import { NpcTemplates } from '../NpcTemplate';
import { NpcRespawnTemplateService } from '../services/NpcRespawnTemplateService';
import { NpcTemplateService } from '../services/NpcTemplateService';
import _ = require('lodash');

const setupEngine = ({ respawnLocation }: RecursivePartial<{ respawnLocation: Location }> = {}) => {
    const npcTemplateService = new NpcTemplateService();
    (npcTemplateService.getData as jest.Mock).mockReturnValue(MockedNpcTemplates)

    const respawnService = new NpcRespawnTemplateService();
    (respawnService.getData as jest.Mock).mockReturnValue({
        'respawn_1': {
            id: 'respawn_1',
            location: respawnLocation ?? { x: 100, y: 100 },
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

describe('PlayerTriesToFinalizeQuestWithNpc action', () => {
    it('Player should get error if he tries to finalize quest with npc that he is not talking with', () => {
        const { players, engineManager } = setupEngine({
            respawnLocation: { x: 151, y: 100 }
        });

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const npcId = _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name).id;

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: NpcClientActions.FinalizeQuestWithNpc,
            npcId,
            questId: Object.keys(NpcTemplates['Manczur'].quests)[0],
        });

        checkIfErrorWasHandled(GlobalStoreModule.NPC_QUESTS, 'You are not talking with such npc.', dataPackage);
    });

    it('Player should get error if he tries to finish quest that this npc is not offering', () => {
        const { players, engineManager } = setupEngine();

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const npcId = _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name).id;

        engineManager.callPlayerAction(players['1'].socketId, {
            type: NpcClientActions.OpenNpcConversationDialog,
            npcId,
        });

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: NpcClientActions.FinalizeQuestWithNpc,
            npcId,
            questId: 'random_id',
        });

        checkIfErrorWasHandled(GlobalStoreModule.NPC_QUESTS, 'This npc does not have such quest.', dataPackage);
    });

    it('Player should get error if he tries to finish quest that character does not have', () => {
        const { players, engineManager } = setupEngine();

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const npcId = _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name).id;

        engineManager.callPlayerAction(players['1'].socketId, {
            type: NpcClientActions.OpenNpcConversationDialog,
            npcId,
        });

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: NpcClientActions.FinalizeQuestWithNpc,
            npcId,
            questId: Object.keys(NpcTemplates['Manczur'].quests)[0],
        });

        checkIfErrorWasHandled(GlobalStoreModule.NPC_QUESTS, 'You does not have that quest.', dataPackage);
    });

    it('Player should get error if he tries to finish quest which is not done yet', () => {
        const { players, engineManager } = setupEngine();

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const npcId = _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name).id;

        engineManager.callPlayerAction(players['1'].socketId, {
            type: NpcClientActions.OpenNpcConversationDialog,
            npcId,
        });

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: NpcClientActions.TakeQuestFromNpc,
            npcId,
            questId: Object.keys(NpcTemplates['Manczur'].quests)[0],
        });

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: NpcClientActions.FinalizeQuestWithNpc,
            npcId,
            questId: Object.keys(NpcTemplates['Manczur'].quests)[0],
        });

        checkIfErrorWasHandled(GlobalStoreModule.NPC_QUESTS, 'This quest is not done yet.', dataPackage);
    });
});
