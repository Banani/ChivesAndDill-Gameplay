export interface Location {
  x: number;
  y: number;
}

export enum CharacterDirection {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export interface Player {
  id: string;
  name: string;
  location: Location;
  direction: CharacterDirection;
  sprites: string;
  isInMove: boolean;
}

export interface Spell {
  projectileId: string;
  name: string;
  angle: number;
  newLocation: Location;
}
