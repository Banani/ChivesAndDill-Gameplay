import type { Quest } from '@bananos/types';

export interface QuestsState {
  quests: Record<string, Quest>;
  activeQuestDetails: Quest;
}

export interface QuestsAwareState {
  questsModule: QuestsState;
}

export interface QuestStartedPayload {
  questTemplate: {
    id: string,
    name: string,
    description: string,
 },
 characterId: string,
}

 export interface QuestCompletedPayload {
    questId: string,
    characterId: string
}

export interface KillingStagePartProgressPayload {
  questId: string,
  stageId: string,
  characterId: string,
  stagePartId: string,
  currentProgress: number,
  targetAmount: number
}

export interface NewQuestStageStartedPayload {
  questId: string,
}