import { Player, Location } from '@bananos/types';

export interface PlayersState {
  activePlayer: string;
  characters: Record<string, Player>;
  characterViewsSettings: any;
  areas: [][];
}

export interface PlayersAwareState {
  playersModule: PlayersState;
}

export interface ChangeLocationPayload {
  selectedPlayerId: string;
  newLocation: Location;
  newDirection: number;
}

export interface ChangePlayerMovingStatusPayload {
  userId: string;
  isInMove: boolean;
}

export interface InitializePayload {
  activePlayer: string;
  characters: Record<string, Player>;
  areas: [][];
}

export interface ChangeImagePayload {
  image: string[];
}

export interface AddPlayerPayload {
  player: Player;
}

export interface DeletePlayerPayload {
  userId: string;
}
