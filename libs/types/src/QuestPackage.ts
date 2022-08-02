import { Location } from '@bananos/types';

export enum QuestType {
   MOVEMENT,
   KILLING,
}

export interface QuestSchema {
   id: string;
   name: string;
   stageOrder?: string[];
   description: string;
   stages?: Record<string, QuestStage>;
}

export interface QuestResetCondition {
   type: QuestResetEvent;
}

export enum QuestResetEvent {
   PlayerLostHp = 'PlayerLostHp',
}

export interface QuestStage {
   id: string;
   description: string;
   stageParts: Record<string, AllQuestStagePart>;
}

export interface QuestStagePart {
   id: string;
   description: string;
   resetConditions?: QuestResetCondition[];
   questId: string;
   stageId: string;
   type: QuestType;
}

export type AllQuestStagePart = MovementQuestStagePart | KillingQuestStagePart;

export interface MovementQuestStagePart extends QuestStagePart {
   type: QuestType.MOVEMENT;
   targetLocation: Location;
   acceptableRange: number;
}

export interface KillingQuestStagePart extends QuestStagePart {
   type: QuestType.KILLING;
   rule: {
      fieldName: string;
      comparison: KillingQuestStagePartComparison;
      value: string;
   }[];
   amount: number;
}

export interface KillingQuestStagePartStatus extends KillingQuestStagePart {
   currentAmount: number;
}

export enum KillingQuestStagePartComparison {
   equality = 'equality',
}

export interface QuestProgress {
   completed: boolean;
   stageId: string;
   stagesParts: Record<string, boolean>;
}

export interface ExternalQuestProgress {
   activeStage: string;
   stagesProgress: Record<string, AllExternalQuestStageProgress>;
}

interface ExternalQuestStageProgress {
   type: QuestType;
   isDone: boolean;
}

interface ExternalKillingQuestStageProgress extends ExternalQuestStageProgress {
   type: QuestType.KILLING;
   currentAmount: number;
}

interface ExternalMovementQuestStageProgress extends ExternalQuestStageProgress {
   type: QuestType.MOVEMENT;
}

export type AllExternalQuestStageProgress = ExternalKillingQuestStageProgress | ExternalMovementQuestStageProgress;
