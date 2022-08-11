export enum CharacterClientEvents {
   ExperienceGain = 'ExperienceGain',
}

export enum ExperienceGainSource {
   MonsterKill = 'MonsterKill',
   QuestCompleted = 'QuestCompleted',
}

export interface ExperienceGainFromKillingMonster {
   type: ExperienceGainSource.MonsterKill;
   monsterId: string;
}

export interface ExperienceGainFromQuest {
   type: ExperienceGainSource.QuestCompleted;
}

export type ExperienceGainDetails = ExperienceGainFromKillingMonster | ExperienceGainFromQuest;

export interface ExperienceGainEvent {
   type: CharacterClientEvents.ExperienceGain;
   characterId: string;
   amount: number;
   experienceGainDetails: ExperienceGainDetails;
}

export type CharacterEvents = ExperienceGainEvent;
