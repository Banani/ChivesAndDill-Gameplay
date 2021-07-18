import { Location } from '../../types';

export enum QuestType {
   MOVEMENT,
   KILLING,
}

export interface Quest {
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
   stageParts: Record<string, MovementQuestStagePart | KillingQuestStagePart>;
}

export interface QuestStagePart {
   id: string;
   resetConditions?: QuestResetCondition[];
   questId: string;
   stageId: string;
   type: QuestType;
}

export interface MovementQuestStagePart extends QuestStagePart {
   targetLocation: Location;
   acceptableRange: number;
}

export interface KillingQuestStagePart extends QuestStagePart {
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
