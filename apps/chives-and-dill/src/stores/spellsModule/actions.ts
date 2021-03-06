import type { FSAAuto } from 'flux-standard-action';
import type {
   InitializeSpellsPayload,
   AddProjectilePayload,
   UpdateProjectilePayload,
   DeleteProjectilePayload,
   AreaSpellEffectCreatedPayload,
   AreaSpellEffectRemovedPayload,
   ActiveSpellCastPayload,
   DeleteSpellCastPayload,
} from '../../types/spells';

export enum SpellsActionTypes {
   INITIALIZE_SPELLS = '[Spells] INITIALIZE_SPELLS',
   ADD_PROJECTILE = '[Spells] ADD_PROJECTILE',
   UPDATE_PROJECTILE = '[Spells] UPDATE_PROJECTILE',
   DELETE_PROJECTILE = '[Spells] DELETE_PROJECTILE',
   AREA_SPELL_EFFECT_CREATED = '[Spells] AREA_SPELL_EFFECT_CREATED',
   AREA_SPELL_EFFECT_REMOVED = '[Spells] AREA_SPELL_EFFECT_REMOVED',
   ADD_ACTIVE_SPELL_CAST = '[Spells] ADD_ACTIVE_SPELL_CAST',
   DELETE_ACTIVE_SPELL_CAST = '[Spells] DELETE_ACTIVE_SPELL_CAST',
   ADD_SPELL_LANDED = '[Spells] ADD_SPELL_LANDED',
   CLEAR_FIRST_LANDED_SPELL = '[Spells] CLEAR_FIRST_LANDED_SPELL',
}

export type InitializeSpells = FSAAuto<SpellsActionTypes.INITIALIZE_SPELLS, InitializeSpellsPayload>;

export type AddProjectile = FSAAuto<SpellsActionTypes.ADD_PROJECTILE, AddProjectilePayload>;

export type UpdateProjectile = FSAAuto<SpellsActionTypes.UPDATE_PROJECTILE, UpdateProjectilePayload>;

export type DeleteProjectile = FSAAuto<SpellsActionTypes.DELETE_PROJECTILE, DeleteProjectilePayload>;

export type AreaSpellEffectCreated = FSAAuto<SpellsActionTypes.AREA_SPELL_EFFECT_CREATED, AreaSpellEffectCreatedPayload>;

export type AreaSpellEffectRemoved = FSAAuto<SpellsActionTypes.AREA_SPELL_EFFECT_REMOVED, AreaSpellEffectRemovedPayload>;

export type AddActiveSpellCast = FSAAuto<SpellsActionTypes.ADD_ACTIVE_SPELL_CAST, ActiveSpellCastPayload>;

export type DeleteActiveSpellCast = FSAAuto<SpellsActionTypes.DELETE_ACTIVE_SPELL_CAST, DeleteSpellCastPayload>;

export type AddSpellLanded = FSAAuto<SpellsActionTypes.ADD_SPELL_LANDED, any>;

export type ClearFirstLandedSpell = FSAAuto<SpellsActionTypes.CLEAR_FIRST_LANDED_SPELL>;

export const initializeSpells = (payload: InitializeSpellsPayload): InitializeSpells => ({
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

export const areaSpellEffectCreated = (payload: AreaSpellEffectCreatedPayload): AreaSpellEffectCreated => ({
   type: SpellsActionTypes.AREA_SPELL_EFFECT_CREATED,
   payload,
});

export const areaSpellEffectRemoved = (payload: AreaSpellEffectRemovedPayload): AreaSpellEffectRemoved => ({
   type: SpellsActionTypes.AREA_SPELL_EFFECT_REMOVED,
   payload,
});

export const addActiveSpellCast = (payload: ActiveSpellCastPayload): AddActiveSpellCast => ({
   type: SpellsActionTypes.ADD_ACTIVE_SPELL_CAST,
   payload,
});

export const deleteActiveSpellCast = (payload: DeleteSpellCastPayload): DeleteActiveSpellCast => ({
   type: SpellsActionTypes.DELETE_ACTIVE_SPELL_CAST,
   payload,
});

export const addSpellLanded = (payload: any): AddSpellLanded => ({
   type: SpellsActionTypes.ADD_SPELL_LANDED,
   payload,
});

export const clearFirstSpellLanded = (): ClearFirstLandedSpell => ({
   type: SpellsActionTypes.CLEAR_FIRST_LANDED_SPELL,
});

export type SpellsAction =
   | InitializeSpells
   | AddProjectile
   | UpdateProjectile
   | DeleteProjectile
   | AreaSpellEffectCreated
   | AreaSpellEffectRemoved
   | AddActiveSpellCast
   | DeleteActiveSpellCast
   | AddSpellLanded
   | ClearFirstLandedSpell;
