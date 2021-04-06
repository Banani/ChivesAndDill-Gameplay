import { FSAAuto } from 'flux-standard-action';
import { ChangeLocationPlayload } from '../../types/players';

export enum PlayersActionTypes {
  CHANGE_PLAYER_POSITION = '[Players] CHANGE_PLAYER_POSITION',
}

export type ChangePlayerPosition = FSAAuto<
  PlayersActionTypes.CHANGE_PLAYER_POSITION,
  ChangeLocationPlayload
>;

export const changePlayerPosition = (
  payload: ChangeLocationPlayload
): ChangePlayerPosition => ({
  type: PlayersActionTypes.CHANGE_PLAYER_POSITION,
  payload,
});

export type PlayerAction = ChangePlayerPosition;
