import { FSAAuto } from 'flux-standard-action';
import {
  ChangeLocationPlayload,
  InitializePlayersPlayload,
} from '../../types/players';

export enum PlayersActionTypes {
  INITIALIZE_CHARACTERS = '[Players] INITIALIZE_CHARACTERS',
  CHANGE_PLAYER_POSITION = '[Players] CHANGE_PLAYER_POSITION',
}

export type ChangePlayerPosition = FSAAuto<
  PlayersActionTypes.CHANGE_PLAYER_POSITION,
  ChangeLocationPlayload
>;

export type InitializePlayers = FSAAuto<
  PlayersActionTypes.INITIALIZE_CHARACTERS,
  InitializePlayersPlayload
>;

export const changePlayerPosition = (
  payload: ChangeLocationPlayload
): ChangePlayerPosition => ({
  type: PlayersActionTypes.CHANGE_PLAYER_POSITION,
  payload,
});

export const initializePlayers = (
  payload: InitializePlayersPlayload
): InitializePlayers => ({
  type: PlayersActionTypes.INITIALIZE_CHARACTERS,
  payload,
});

export type PlayerAction = ChangePlayerPosition | InitializePlayers;
