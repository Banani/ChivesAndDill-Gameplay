import type { Location } from '@bananos/types';
import { MonsterTemplate } from '../modules/MonsterModule/MonsterTemplates';
import { NpcTemplate } from '../modules/NpcModule/NpcTemplate';

export enum WalkingType {
   None,
   Stroll,
   Patrol,
}

export interface CharacterRespawn<T> {
   location: Location;
   characterTemplate: T;
   time: number;
   id: string;
   walkingType: WalkingType;
   patrolPath?: Location[];
}
