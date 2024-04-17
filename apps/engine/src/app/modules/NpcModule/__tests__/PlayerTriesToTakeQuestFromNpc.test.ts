import { GlobalStoreModule, Location, NpcClientActions, QuestType, RecursivePartial } from '@bananos/types';
import { EngineManager, checkIfErrorWasHandled, checkIfPackageIsValid } from 'apps/engine/src/app/testUtilities';
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

describe('PlayerTriesToTakeQuestFromNpc action', () => {
    it('Player should be notified about new quest when he is taking that quest', () => {
        const { players, engineManager } = setupEngine();

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const npcId = _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name).id;

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: NpcClientActions.TakeQuestFromNpc,
            npcId,
            questId: Object.keys(NpcTemplates['Manczur'].quests)[0],
        });

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

    it('Player should get error if he tries to start take quest from npc that does not exist', () => {
        const { players, engineManager } = setupEngine();

        let dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: NpcClientActions.TakeQuestFromNpc,
            npcId: 'some_random_npc',
            questId: 'random_id',
        });

        checkIfErrorWasHandled(GlobalStoreModule.NPC_QUESTS, 'That npc does not exist.', dataPackage);
    });

    it('Player should get error if he tries to start take quest from npc that is too far away', () => {
        const { players, engineManager } = setupEngine({
            respawnLocation: { x: 251, y: 100 }
        });

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const npcId = _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name).id;

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: NpcClientActions.TakeQuestFromNpc,
            npcId,
            questId: 'random_id',
        });

        checkIfErrorWasHandled(GlobalStoreModule.NPC_QUESTS, 'You are too far away.', dataPackage);
    });

    it('Player should get error if he tries to take quest that this npc is not offering', () => {
        const { players, engineManager } = setupEngine();

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const npcId = _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name).id;

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: NpcClientActions.TakeQuestFromNpc,
            npcId,
            questId: 'random_id',
        });

        checkIfErrorWasHandled(GlobalStoreModule.NPC_QUESTS, 'This npc does not have such quest.', dataPackage);
    });

    it('Player should get error when tries to take the same quest second time', () => {
        const { players, engineManager } = setupEngine();

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const npcId = _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name).id;

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: NpcClientActions.TakeQuestFromNpc,
            npcId,
            questId: Object.keys(NpcTemplates['Manczur'].quests)[0],
        });

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: NpcClientActions.TakeQuestFromNpc,
            npcId,
            questId: Object.keys(NpcTemplates['Manczur'].quests)[0],
        });

        checkIfErrorWasHandled(GlobalStoreModule.NPC_QUESTS, 'You already have that quest.', dataPackage);
    });
});
