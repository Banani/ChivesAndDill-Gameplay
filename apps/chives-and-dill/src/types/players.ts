import { Player, Location } from "@bananos/types";


export interface PlayersState {
  characters: Record<string, Player>;
}

export interface PlayersAwareState {
  playersModule: PlayersState;
}

export interface ChangeLocationPlayload {
  selectedPlayerId: string;
  newLocation: Location;
}

export interface InitializePlayersPlayload {
  characters: Record<string, Player>;
}

export interface AddPlayerPayload {
  player: Player;
}

export interface DeletePlayerPayload {
  userId: string;
}
