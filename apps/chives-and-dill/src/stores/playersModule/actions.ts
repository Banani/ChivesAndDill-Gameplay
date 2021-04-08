import { FSAAuto } from 'flux-standard-action';
import {
  ChangeLocationPlayload,
  InitializePlayersPlayload,
  AddPlayerPayload,
  DeletePlayerPayload
} from '../../types/players';

export enum PlayersActionTypes {
  INITIALIZE_CHARACTERS = '[Players] INITIALIZE_CHARACTERS',
  CHANGE_PLAYER_POSITION = '[Players] CHANGE_PLAYER_POSITION',
  ADD_PLAYER = '[Players] ADD_PLAYER',
  DELETE_PLAYER = '[Players] DELETE_PLAYER',
}

export type ChangePlayerPosition = FSAAuto<
  PlayersActionTypes.CHANGE_PLAYER_POSITION,
  ChangeLocationPlayload
>;

export type InitializePlayers = FSAAuto<
  PlayersActionTypes.INITIALIZE_CHARACTERS,
  InitializePlayersPlayload
>;

export type AddPlayer = FSAAuto<
  PlayersActionTypes.ADD_PLAYER,
  AddPlayerPayload
>;

export type DeletePlayer = FSAAuto<
  PlayersActionTypes.DELETE_PLAYER,
  DeletePlayerPayload
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

export const addPlayer = (
  payload: AddPlayerPayload
): AddPlayer => ({
  type: PlayersActionTypes.ADD_PLAYER,
  payload,
});

export const deletePlayer = (
  payload: DeletePlayerPayload
): DeletePlayer => ({
  type: PlayersActionTypes.DELETE_PLAYER,
  payload,
});

export type PlayerAction = ChangePlayerPosition | InitializePlayers | AddPlayer | DeletePlayer;
