import type { FSAAuto } from 'flux-standard-action';
import type {
  ChangeLocationPayload,
  InitializePayload,
  AddPlayerPayload,
  DeletePlayerPayload,
  ChangePlayerMovingStatusPayload,
  AddProjectilePayload,
  UpdateProjectilePayload,
  DeleteProjectilePayload,
  UpdateCharacterHpPayload,
  CharacterDiedPayload,
} from '../../types/players';

export enum PlayersActionTypes {
  INITIALIZE = '[Players] INITIALIZE',
  CHANGE_PLAYER_POSITION = '[Players] CHANGE_PLAYER_POSITION',
  ADD_PLAYER = '[Players] ADD_PLAYER',
  DELETE_PLAYER = '[Players] DELETE_PLAYER',
  CHANGE_PLAYER_MOVING_STATUS = '[Players] CHANGE_PLAYER_MOVING_STATUS',
  ADD_PROJECTILE = '[Players] ADD_PROJECTILE',
  UPDATE_PROJECTILE = '[Players] UPDATE_PROJECTILE',
  DELETE_PROJECTILE = '[Players] DELETE_PROJECTILE',
  UPDATE_CHARACTER_HP = '[Players] UPDATE_CHARACTERS_HP',
  CHARACTER_DIED = '[Players] CHARACTER_DIED',
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

export type AddProjectile = FSAAuto<
  PlayersActionTypes.ADD_PROJECTILE,
  AddProjectilePayload
>;

export type UpdateProjectile = FSAAuto<
  PlayersActionTypes.UPDATE_PROJECTILE,
  UpdateProjectilePayload
>;

export type DeleteProjectile = FSAAuto<
  PlayersActionTypes.DELETE_PROJECTILE,
  DeleteProjectilePayload
>;

export type UpdateCharacterHp = FSAAuto<
  PlayersActionTypes.UPDATE_CHARACTER_HP,
  UpdateCharacterHpPayload
>;

export type CharacterDied = FSAAuto<
  PlayersActionTypes.CHARACTER_DIED,
  CharacterDiedPayload
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

export const addProjectile = (payload: AddProjectilePayload): AddProjectile => ({
  type: PlayersActionTypes.ADD_PROJECTILE,
  payload,
});

export const updateProjectile = (payload: UpdateProjectilePayload): UpdateProjectile => ({
  type: PlayersActionTypes.UPDATE_PROJECTILE,
  payload,
});

export const deleteProjectile = (payload: DeleteProjectilePayload): DeleteProjectile => ({
  type: PlayersActionTypes.DELETE_PROJECTILE,
  payload,
});

export const updateCharacterHp = (payload: UpdateCharacterHpPayload): UpdateCharacterHp => ({
  type: PlayersActionTypes.UPDATE_CHARACTER_HP,
  payload,
});

export const characterDied = (payload: CharacterDiedPayload): CharacterDied => ({
  type: PlayersActionTypes.CHARACTER_DIED,
  payload,
});

export type PlayerAction =
  | ChangePlayerPosition
  | Initialize
  | AddPlayer
  | DeletePlayer
  | ChangePlayerMovingStatus
  | AddProjectile
  | UpdateProjectile
  | DeleteProjectile
  | UpdateCharacterHp
  | CharacterDied;
