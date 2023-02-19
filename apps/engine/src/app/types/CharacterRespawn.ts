import type { Location } from '@bananos/types';

export enum WalkingType {
   None = "None",
   Stroll = "Stroll",
   Patrol = "Patrol",
}

export interface CharacterRespawn<T> {
   location: Location;
   characterTemplate: T;
   time: number;
   id: string;
   walkingType: WalkingType;
   patrolPath?: Location[];
}
