import type { Location } from '@bananos/types';

export enum WalkingType {
    None = "None",
    Stroll = "Stroll",
    Patrol = "Patrol",
}

export interface CharacterRespawn {
    location: Location;
    // characterType: "",
    characterTemplateId: string;
    time: number;
    id: string;
    walkingType: WalkingType;
    patrolPath?: Location[];
}
