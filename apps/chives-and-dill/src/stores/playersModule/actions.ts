import { CharacterDied } from './actions';
import type { FSAAuto } from 'flux-standard-action';
import type {
  ChangeLocationPayload,
  InitializePayload,
  AddPlayerPayload,
  DeletePlayerPayload,
  ChangePlayerMovingStatusPayload,
  AddSpellPayload,
  UpdateSpellPayload,
  DeleteProjectilePayload,
  UpdateCharacterHpPayload,
  CharacterDiedPayload,
  QuestStartedPayload,
  QuestCompletedPayload,
  KillingStagePartProgressPayload,
} from '../../types/players';

export enum PlayersActionTypes {
  INITIALIZE = '[Players] INITIALIZE',
  CHANGE_PLAYER_POSITION = '[Players] CHANGE_PLAYER_POSITION',
  ADD_PLAYER = '[Players] ADD_PLAYER',
  DELETE_PLAYER = '[Players] DELETE_PLAYER',
  CHANGE_PLAYER_MOVING_STATUS = '[Players] CHANGE_PLAYER_MOVING_STATUS',
  ADD_SPELL = '[Players] ADD_SPELL',
  UPDATE_SPELL = '[Players] UPDATE_SPELL',
  DELETE_PROJECTILE = '[Players] DELETE_PROJECTILE',
  UPDATE_CHARACTER_HP = '[Players] UPDATE_CHARACTERS_HP',
  CHARACTER_DIED = '[Players] CHARACTER_DIED',
  QUEST_STARTED = '[Players] QUEST_STARTED',
  QUEST_COMPLETED = '[Players] QUEST_COMPLETED',
  KILLING_STAGE_PART_PROGRESS = '[Players] KILLING_STAGE_PART_PROGRESS',
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

export type QuestStarted = FSAAuto<
  PlayersActionTypes.QUEST_STARTED,
  QuestStartedPayload
>;

export type QuestCompleted = FSAAuto<
  PlayersActionTypes.QUEST_COMPLETED,
  QuestCompletedPayload
>;

export type ChangePlayerMovingStatus = FSAAuto<
  PlayersActionTypes.CHANGE_PLAYER_MOVING_STATUS,
  ChangePlayerMovingStatusPayload
>;

export type KillingStagePartProgress = FSAAuto<
  PlayersActionTypes.KILLING_STAGE_PART_PROGRESS,
  KillingStagePartProgressPayload
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

export const questStarted = (payload: QuestStartedPayload): QuestStarted => ({
  type: PlayersActionTypes.QUEST_STARTED,
  payload,
});

export const questCompleted = (payload: QuestCompletedPayload): QuestCompleted => ({
  type: PlayersActionTypes.QUEST_COMPLETED,
  payload,
});

export const killingStagePartProgress = (payload: KillingStagePartProgressPayload): KillingStagePartProgress => ({
  type: PlayersActionTypes.KILLING_STAGE_PART_PROGRESS,
  payload,
});

export type PlayerAction =
  | ChangePlayerPosition
  | Initialize
  | AddPlayer
  | DeletePlayer
  | ChangePlayerMovingStatus
  | AddSpell
  | UpdateSpell
  | DeleteProjectile
  | UpdateCharacterHp
  | CharacterDied
  | QuestStarted
  | QuestCompleted
  | KillingStagePartProgress;
