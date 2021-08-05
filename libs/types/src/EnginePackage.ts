import { Location } from './common/Location';
import { CharacterDirection } from './shared';

export interface EnginePackage {
   characterMovements: {
      data: Record<string, Partial<CharacterMovement>>;
      toDelete: string[];
   };
   projectileMovements: {
      data: Record<string, Partial<ProjectileMovement>>;
      toDelete: string[];
   };
}

export interface GlobalStore {
   characterMovements: Record<string, CharacterMovement>;
   projectileMovements: Record<string, ProjectileMovement>;
}

export interface CharacterMovement {
   location: Location;
   isInMove: boolean;
   direction: CharacterDirection;
}

export interface ProjectileMovement {
   location: Location;
   angle: number;
   spellName: string;
}
