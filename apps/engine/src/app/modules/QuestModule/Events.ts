import { AllQuestStagePart, QuestSchema, QuestStage } from 'libs/types/src/QuestPackage';
import { EngineEvent, EngineEventHandler } from '../../types';

export enum QuestEngineEvents {
   StartQuest = 'StartQuest',
   QuestStarted = 'QuestStarted',
   NewQuestStageStarted = 'NewQuestStageStarted',
   StartNewQuestStagePart = 'StartNewQuestStagePart',
   KillingStagePartProgress = 'KillingStagePartProgress',
   StagePartCompleted = 'StagePartCompleted',
   QuestCompleted = 'QuestCompleted',
}

export interface StartQuestEvent extends EngineEvent {
   type: QuestEngineEvents.StartQuest;
   characterId: string;
   questId: string;
}

export interface StartNewQuestStagePartEvent extends EngineEvent {
   type: QuestEngineEvents.StartNewQuestStagePart;
   stagePart: AllQuestStagePart;
   characterId: string;
}

export interface StagePartCompletedEvent extends EngineEvent {
   type: QuestEngineEvents.StagePartCompleted;
   characterId: string;
   questId: string;
   stageId: string;
   stagePartId: string;
}

export interface KillingStagePartProgressEvent extends EngineEvent {
   type: QuestEngineEvents.KillingStagePartProgress;
   characterId: string;
   stagePartId: string;
   questId: string;
   stageId: string;
   currentProgress: number;
   targetAmount: number;
}

export interface QuestStartedEvent extends EngineEvent {
   type: QuestEngineEvents.QuestStarted;
   characterId: string;
   questTemplate: QuestSchema;
}

export interface QuestCompletedEvent extends EngineEvent {
   type: QuestEngineEvents.QuestCompleted;
   questId: string;
   characterId: string;
}

export interface NewQuestStageStartedEvent extends EngineEvent {
   type: QuestEngineEvents.NewQuestStageStarted;
   questId: string;
   characterId: string;
   questStage: QuestStage;
}

export interface QuestEngineEventsMap {
   [QuestEngineEvents.StartQuest]: EngineEventHandler<StartQuestEvent>;
   [QuestEngineEvents.QuestStarted]: EngineEventHandler<QuestStartedEvent>;
   [QuestEngineEvents.StagePartCompleted]: EngineEventHandler<StagePartCompletedEvent>;
   [QuestEngineEvents.KillingStagePartProgress]: EngineEventHandler<KillingStagePartProgressEvent>;
   [QuestEngineEvents.QuestCompleted]: EngineEventHandler<QuestCompletedEvent>;
   [QuestEngineEvents.NewQuestStageStarted]: EngineEventHandler<NewQuestStageStartedEvent>;
   [QuestEngineEvents.StartNewQuestStagePart]: EngineEventHandler<StartNewQuestStagePartEvent>;
}
