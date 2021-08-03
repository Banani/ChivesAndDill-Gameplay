import type { QuestsAwareState } from '../../types/quests';

const getQuestsModule = (state: QuestsAwareState) => state.questsModule;

export const selectQuests = (state: QuestsAwareState) => getQuestsModule(state).quests;

export const selectActiveQuestDetails = (state: QuestsAwareState) => getQuestsModule(state).activeQuestDetails;