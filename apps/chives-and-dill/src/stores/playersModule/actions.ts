import { FSAAuto } from 'flux-standard-action';
import {
  ChangeLocationPayload,
  InitializePayload,
  AddPlayerPayload,
  DeletePlayerPayload,
  ChangePlayerMovingStatusPayload,
  AddSpellPayload,
  UpdateSpellPayload,
} from '../../types/players';

export enum PlayersActionTypes {
  INITIALIZE = '[Players] INITIALIZE',
  CHANGE_PLAYER_POSITION = '[Players] CHANGE_PLAYER_POSITION',
  ADD_PLAYER = '[Players] ADD_PLAYER',
  DELETE_PLAYER = '[Players] DELETE_PLAYER',
  CHANGE_PLAYER_MOVING_STATUS = '[Players] CHANGE_PLAYER_MOVING_STATUS',
  ADD_SPELL = '[Players] ADD_SPELL',
  UPDATE_SPELL = '[Players] UPDATE_SPELL',
}

export type ChangePlayerPosition = FSAAuto<
  PlayersActionTypes.CHANGE_PLAYER_POSITION,
  ChangeLocationPayload
>;

export type Initialize = FSAAuto<
  PlayersActionTypes.INITIALIZE,
  InitializePayload
>;

export type AddPlayer = FSAAuto<
  PlayersActionTypes.ADD_PLAYER,
  AddPlayerPayload
>;

export type DeletePlayer = FSAAuto<
  PlayersActionTypes.DELETE_PLAYER,
  DeletePlayerPayload
>;

export type AddSpell = FSAAuto<
  PlayersActionTypes.ADD_SPELL,
  AddSpellPayload
>;

export type UpdateSpell = FSAAuto<
  PlayersActionTypes.UPDATE_SPELL,
  UpdateSpellPayload
>;

export type ChangePlayerMovingStatus = FSAAuto<
  PlayersActionTypes.CHANGE_PLAYER_MOVING_STATUS,
  ChangePlayerMovingStatusPayload
>;

export const changePlayerPosition = (
  payload: ChangeLocationPayload
): ChangePlayerPosition => ({
  type: PlayersActionTypes.CHANGE_PLAYER_POSITION,
  payload,
});

export const changePlayerMovingStatus = (
  payload: ChangePlayerMovingStatusPayload
): ChangePlayerMovingStatus => ({
  type: PlayersActionTypes.CHANGE_PLAYER_MOVING_STATUS,
  payload,
});

export const initialize = (
  payload: InitializePayload
): Initialize => ({
  type: PlayersActionTypes.INITIALIZE,
  payload,
});

export const addPlayer = (payload: AddPlayerPayload): AddPlayer => ({
  type: PlayersActionTypes.ADD_PLAYER,
  payload,
});

export const deletePlayer = (payload: DeletePlayerPayload): DeletePlayer => ({
  type: PlayersActionTypes.DELETE_PLAYER,
  payload,
});

export const addSpell = (payload: AddSpellPayload): AddSpell => ({
  type: PlayersActionTypes.ADD_SPELL,
  payload,
});

export const updateSpell = (payload: UpdateSpellPayload): UpdateSpell => ({
  type: PlayersActionTypes.UPDATE_SPELL,
  payload,
});

export type PlayerAction =
  | ChangePlayerPosition
  | Initialize
  | AddPlayer
  | DeletePlayer
  | ChangePlayerMovingStatus
  | AddSpell
  | UpdateSpell;
