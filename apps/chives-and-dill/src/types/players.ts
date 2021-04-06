import type { Location, CharacterDirection } from './shared';

export interface PlayersState {
  characters: Record<string, Player>;
}

export interface PlayersAwareState {
  playersModule: PlayersState;
}

export interface Player {
  name: string;
  location: Location;
  direction: CharacterDirection;
  image: string
}

export interface ChangeLocationPlayload {
  selectedPlayerId: string;
  newLocation: Location;
}
