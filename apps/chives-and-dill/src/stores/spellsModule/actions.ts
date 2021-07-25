import type { FSAAuto } from 'flux-standard-action';
import type {
  InitializeSpellsPayload,
  AddProjectilePayload,
  UpdateProjectilePayload,
  DeleteProjectilePayload,
} from '../../types/spells';

export enum SpellsActionTypes {
  INITIALIZE_SPELLS = '[Spells] INITIALIZE_SPELLS',
  ADD_PROJECTILE = '[Spells] ADD_PROJECTILE',
  UPDATE_PROJECTILE = '[Spells] UPDATE_PROJECTILE',
  DELETE_PROJECTILE = '[Spells] DELETE_PROJECTILE',
}

export type InitializeSpells = FSAAuto<
  SpellsActionTypes.INITIALIZE_SPELLS,
  InitializeSpellsPayload
>;

export type AddProjectile = FSAAuto<
  SpellsActionTypes.ADD_PROJECTILE,
  AddProjectilePayload
>;

export type UpdateProjectile = FSAAuto<
  SpellsActionTypes.UPDATE_PROJECTILE,
  UpdateProjectilePayload
>;

export type DeleteProjectile = FSAAuto<
  SpellsActionTypes.DELETE_PROJECTILE,
  DeleteProjectilePayload
>;

export const initializeSpells = (
  payload: InitializeSpellsPayload
): InitializeSpells => ({
  type: SpellsActionTypes.INITIALIZE_SPELLS,
  payload,
});

export const addProjectile = (payload: AddProjectilePayload): AddProjectile => ({
  type: SpellsActionTypes.ADD_PROJECTILE,
  payload,
});

export const updateProjectile = (payload: UpdateProjectilePayload): UpdateProjectile => ({
  type: SpellsActionTypes.UPDATE_PROJECTILE,
  payload,
});

export const deleteProjectile = (payload: DeleteProjectilePayload): DeleteProjectile => ({
  type: SpellsActionTypes.DELETE_PROJECTILE,
  payload,
});

export type SpellsAction =
  | InitializeSpells
  | AddProjectile
  | UpdateProjectile
  | DeleteProjectile;
