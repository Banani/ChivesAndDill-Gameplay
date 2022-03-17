export enum CharacterClientEvents {
   ExperienceGain = 'ExperienceGain',
}

export enum ExperienceGainSource {
   MonsterKill = 'MonsterKill',
}

export interface ExperienceGainFromKillingMonster {
   type: ExperienceGainSource.MonsterKill;
   monsterId: string;
}

export type ExperienceGainDetails = ExperienceGainFromKillingMonster;

export interface ExperienceGainEvent {
   type: CharacterClientEvents.ExperienceGain;
   characterId: string;
   amount: number;
   experienceGainDetails: ExperienceGainDetails;
}

export type CharacterEvents = ExperienceGainEvent;
