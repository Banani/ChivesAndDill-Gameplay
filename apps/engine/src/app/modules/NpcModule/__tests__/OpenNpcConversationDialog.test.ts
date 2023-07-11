import { GlobalStoreModule, Location, NpcClientMessages, QuestType, RecursivePartial } from '@bananos/types';
import { EngineManager, checkIfErrorWasHandled, checkIfPackageIsValid } from 'apps/engine/src/app/testUtilities';
import { WalkingType } from 'apps/engine/src/app/types/CharacterRespawn';
import { MockedNpcTemplates } from '../../../mocks';
import { QuestCompletedEvent, QuestEngineEvents } from '../../QuestModule/Events';
import { Quests } from '../../QuestModule/Quests';
import { NpcEngineEvents, NpcRespawnsUpdatedEvent } from '../Events';
import { NpcTemplates } from '../NpcTemplate';
import { NpcRespawnTemplateService } from '../services/NpcRespawnTemplateService';
import { NpcTemplateService } from '../services/NpcTemplateService';
import _ = require('lodash');

const CURRENT_MODULE = GlobalStoreModule.NPC_CONVERSATION;

interface SetupProps { respawnLocation: Location }

const setupEngine = ({ respawnLocation }: RecursivePartial<SetupProps> = {}) => {
    const npcTemplateService = new NpcTemplateService();
    (npcTemplateService.getData as jest.Mock).mockReturnValue(MockedNpcTemplates)

    const respawnService = new NpcRespawnTemplateService();
    (respawnService.getData as jest.Mock).mockReturnValue({
        'respawn_1': {
            id: 'respawn_1',
            location: respawnLocation ?? { x: 100, y: 100 },
            characterTemplateId: "1",
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

describe('OpenNpcConversationDialog action', () => {
    it('Player should be able to start conversation', () => {
        const { players, engineManager } = setupEngine();

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const npcId = _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name).id;

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: NpcClientMessages.OpenNpcConversationDialog,
            npcId,
        });

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
            data: { playerCharacter_1: { npcId } },
        });
    });

    it('Player should get error if he tries to start conversation with npc that does not exist', () => {
        const { players, engineManager } = setupEngine();

        let dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: NpcClientMessages.OpenNpcConversationDialog,
            npcId: 'some_random_npc',
        });

        checkIfErrorWasHandled(CURRENT_MODULE, 'That npc does not exist.', dataPackage);
    });

    it('Player should get error if he tries to start conversation with npc that is too far away', () => {
        const respawnLocation: Location = { x: 151, y: 100 }
        const { players, engineManager } = setupEngine({ respawnLocation });

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const npcId = _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name).id;

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: NpcClientMessages.OpenNpcConversationDialog,
            npcId,
        });

        checkIfErrorWasHandled(CURRENT_MODULE, 'You are too far away.', dataPackage);
    });

    // TODO: Fix this after integrating with creator quests

    it.skip('Player should be informed about quests that NPC provides when starting conversation', () => {
        const quests = { '1': Quests['1'] };
        const { players, engineManager } = setupEngine();

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const npcId = _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name).id;

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: NpcClientMessages.OpenNpcConversationDialog,
            npcId,
        });

        const quest = Quests['1'];
        checkIfPackageIsValid(GlobalStoreModule.QUEST_DEFINITION, dataPackage, {
            data: {
                '1': {
                    name: quest.name,
                    description: quest.description,
                    questReward: quest.questReward,
                    stageOrder: [quest.stageOrder[0]],
                    stages: {
                        '1': {
                            description: 'Go to Twilight Outpost',
                            stageParts: {
                                '1': {
                                    locationName: 'Twilight Outpost',
                                    type: QuestType.MOVEMENT,
                                },
                                '2': {
                                    monsterName: 'Orc Spearmen',
                                    type: QuestType.KILLING,
                                    amount: 6,
                                },
                            },
                        },
                    },
                },
            },
        });
    });

    it.skip('Player should not be get quest definition when the quest is already done', () => {
        const quests = { '1': Quests['1'] };
        const { players, engineManager } = setupEngine();

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        const npcId = _.find(dataPackage.character.data, (character) => character.name == NpcTemplates['Manczur'].name).id;

        engineManager.createSystemAction<QuestCompletedEvent>({
            type: QuestEngineEvents.QuestCompleted,
            characterId: players['1'].characterId,
            questId: '1',
        });

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: NpcClientMessages.OpenNpcConversationDialog,
            npcId,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(GlobalStoreModule.QUEST_DEFINITION, dataPackage, undefined);
    });
});
