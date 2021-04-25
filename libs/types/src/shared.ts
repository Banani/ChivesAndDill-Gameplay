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
    x(x: any, y: any, arg2: number, arg3: number);
    y(x: any, y: any, arg2: number, arg3: number);
    id: string;
    name: string;
    location: Location;
    direction: CharacterDirection;
    sprites: string;
    isInMove: boolean;
}