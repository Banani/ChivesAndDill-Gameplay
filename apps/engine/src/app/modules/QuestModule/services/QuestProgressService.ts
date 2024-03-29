
import { QuestProgress, QuestSchema } from '@bananos/types';
import { filter, forEach, keyBy, mapValues } from 'lodash';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import {
    AllQuestStagesCompletedEvent,
    NewQuestStageStartedEvent,
    QuestEngineEvents,
    QuestStartedEvent,
    StagePartCompletedEvent,
    StartNewQuestStagePartEvent,
    StartQuestEvent,
} from '../Events';

export class QuestProgressService extends EventParser {
    questProgress: Record<string, Record<string, QuestProgress>> = {};

    constructor() {
        super();
        this.eventsToHandlersMap = {
            [QuestEngineEvents.StartQuest]: this.handleStartQuest,
            [QuestEngineEvents.StagePartCompleted]: this.handleStagePartCompleted,
            [PlayerEngineEvents.PlayerCharacterCreated]: this.handlePlayerCharacterCreated,
        };
    }

    handlePlayerCharacterCreated: EngineEventHandler<PlayerCharacterCreatedEvent> = ({ event, services }) => {
        this.questProgress[event.playerCharacter.id] = {};
    };

    handleStartQuest: EngineEventHandler<StartQuestEvent> = ({ event, services }) => {
        const quests = services.questSchemasService.getData();
        const quest = quests[event.questId];

        this.engineEventCrator.asyncCeateEvent<QuestStartedEvent>({
            type: QuestEngineEvents.QuestStarted,
            questTemplate: {
                id: quest.id,
                name: quest.name,
                description: quest.description,
                questReward: quest.questReward,
            },
            characterId: event.characterId,
        });

        const firstStageId = quest.stageOrder[0];
        this.startAllStagesParts({
            characterId: event.characterId,
            stageId: firstStageId,
            questId: quest.id,
            quests,
        });
    };

    startAllStagesParts = ({
        characterId,
        stageId,
        questId,
        quests,
    }: {
        characterId: string;
        stageId: string;
        questId: string;
        quests: Record<string, QuestSchema>;
    }) => {
        this.questProgress[characterId][questId] = {
            completed: false,
            stageId: stageId,
            stagesParts: mapValues(keyBy(quests[questId].stages[stageId].stageParts, 'id'), () => false),
        };

        this.engineEventCrator.asyncCeateEvent<NewQuestStageStartedEvent>({
            type: QuestEngineEvents.NewQuestStageStarted,
            questId,
            characterId,
            questStage: quests[questId].stages[stageId],
        });

        forEach(quests[questId].stages[stageId].stageParts, (stagePart) => {
            this.engineEventCrator.asyncCeateEvent<StartNewQuestStagePartEvent>({
                type: QuestEngineEvents.StartNewQuestStagePart,
                characterId,
                stagePart,
            });
        });
    };

    handleStagePartCompleted: EngineEventHandler<StagePartCompletedEvent> = ({ event, services }) => {
        const quests = services.questSchemasService.getData();
        const { stagesParts } = this.questProgress[event.characterId][event.questId];
        stagesParts[event.stagePartId] = true;
        const remainingStages = filter(stagesParts, (stage) => !stage).length;

        if (!remainingStages) {
            const { stageOrder } = quests[event.questId];
            const completedStageIndex = stageOrder.indexOf(event.stageId);
            if (completedStageIndex === stageOrder.length - 1) {
                this.questProgress[event.characterId][event.questId].completed = true;
                this.engineEventCrator.asyncCeateEvent<AllQuestStagesCompletedEvent>({
                    type: QuestEngineEvents.AllQuestStagesCompleted,
                    questId: event.questId,
                    characterId: event.characterId,
                });
            } else {
                this.startAllStagesParts({
                    characterId: event.characterId,
                    stageId: stageOrder[completedStageIndex + 1],
                    questId: event.questId,
                    quests,
                });
            }
        }
    };

    isQuestInProgress = (characterId: string, questId: string) => !!this.questProgress[characterId][questId];

    isQuestDone = (characterId: string, questId: string) => this.questProgress[characterId][questId].completed;
}
