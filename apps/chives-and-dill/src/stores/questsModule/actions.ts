import type { FSAAuto } from 'flux-standard-action';
import type {
  QuestStartedPayload,
  QuestCompletedPayload,
  KillingStagePartProgressPayload,
  NewQuestStageStartedPayload,
} from '../../types/quests';

export enum QuestsActionTypes {
  QUEST_STARTED = '[QUESTS] QUEST_STARTED',
  QUEST_COMPLETED = '[QUESTS] QUEST_COMPLETED',
  KILLING_STAGE_PART_PROGRESS = '[QUESTS] KILLING_STAGE_PART_PROGRESS',
  NEW_QUEST_STAGE_STARTED = '[QUESTS] NEW_QUEST_STAGE_STARTED',
}

export type QuestStarted = FSAAuto<
  QuestsActionTypes.QUEST_STARTED,
  QuestStartedPayload
>;

export type QuestCompleted = FSAAuto<
  QuestsActionTypes.QUEST_COMPLETED,
  QuestCompletedPayload
>;

export type KillingStagePartProgress = FSAAuto<
  QuestsActionTypes.KILLING_STAGE_PART_PROGRESS,
  KillingStagePartProgressPayload
>;

export type NewQuestStageStarted = FSAAuto<
  QuestsActionTypes.NEW_QUEST_STAGE_STARTED,
  NewQuestStageStartedPayload
>;

export const questStarted = (payload: QuestStartedPayload): QuestStarted => ({
  type: QuestsActionTypes.QUEST_STARTED,
  payload,
});

export const questCompleted = (payload: QuestCompletedPayload): QuestCompleted => ({
  type: QuestsActionTypes.QUEST_COMPLETED,
  payload,
});

export const killingStagePartProgress = (payload: KillingStagePartProgressPayload): KillingStagePartProgress => ({
  type: QuestsActionTypes.KILLING_STAGE_PART_PROGRESS,
  payload,
});

export const newQuestStageStarted = (payload: NewQuestStageStartedPayload): NewQuestStageStarted => ({
  type: QuestsActionTypes.NEW_QUEST_STAGE_STARTED,
  payload,
});

export type QuestAction =
  | QuestStarted
  | QuestCompleted
  | KillingStagePartProgress
  | NewQuestStageStarted;
