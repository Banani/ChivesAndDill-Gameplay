import { KillingQuestStagePart, MovementQuestStagePart, QuestSchema, QuestStage } from 'libs/types/src/QuestPackage';
import { EngineEvent, EngineEventHandler } from '../../types';

export enum QuestEngineEvents {
   StartQuest = 'StartQuest',
   QUEST_STARTED = 'QUEST_STARTED',
   START_NEW_QUEST_MOVEMENT_STAGE_PART = 'START_NEW_QUEST_MOVEMENT_STAGE_PART',
   START_NEW_QUEST_KILLING_STAGE_PART = 'START_NEW_QUEST_KILLING_STAGE_PART',
   STAGE_PART_COMPLETED = 'STAGE_PART_COMPLETED',
   KILLING_STAGE_PART_PROGRESS = 'KILLING_STAGE_PART_PROGRESS',
   QUEST_COMPLETED = 'QUEST_COMPLETED',
   NewQuestStageStarted = 'newQuestStageStarted',
}

export interface StartQuestEvent extends EngineEvent {
   characterId: string;
   questId: string;
}

export interface StartNewQuestMovementStagePartEvent extends EngineEvent {
   stagePart: MovementQuestStagePart;
   characterId: string;
}

export interface StartNewQuestKillingStagePartEvent extends EngineEvent {
   stagePart: KillingQuestStagePart;
   characterId: string;
}

export interface StagePartCompletedEvent extends EngineEvent {
   characterId: string;
   questId: string;
   stageId: string;
   stagePartId: string;
}

export interface KillingStagePartProgress extends EngineEvent {
   characterId: string;
   stagePartId: string;
   questId: string;
   stageId: string;
   currentProgress: number;
   targetAmount: number;
}

export interface QuestStartedEvent extends EngineEvent {
   characterId: string;
   questTemplate: QuestSchema;
}

export interface QuestCompletedEvent extends EngineEvent {
   questId: string;
   characterId: string;
}

export interface NewQuestStageStartedEvent extends EngineEvent {
   questId: string;
   characterId: string;
   questStage: QuestStage;
}

export interface QuestEngineEventsMap {
   [QuestEngineEvents.StartQuest]: EngineEventHandler<StartQuestEvent>;
   [QuestEngineEvents.QUEST_STARTED]: EngineEventHandler<QuestStartedEvent>;
   [QuestEngineEvents.START_NEW_QUEST_MOVEMENT_STAGE_PART]: EngineEventHandler<StartNewQuestMovementStagePartEvent>;
   [QuestEngineEvents.START_NEW_QUEST_KILLING_STAGE_PART]: EngineEventHandler<StartNewQuestKillingStagePartEvent>;
   [QuestEngineEvents.STAGE_PART_COMPLETED]: EngineEventHandler<StagePartCompletedEvent>;
   [QuestEngineEvents.KILLING_STAGE_PART_PROGRESS]: EngineEventHandler<KillingStagePartProgress>;
   [QuestEngineEvents.QUEST_COMPLETED]: EngineEventHandler<QuestCompletedEvent>;
   [QuestEngineEvents.NewQuestStageStarted]: EngineEventHandler<NewQuestStageStartedEvent>;
}
