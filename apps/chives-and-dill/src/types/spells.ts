import type { Spell, Projectile } from '@bananos/types';

export interface SpellsState {
  projectiles: Record<string, Projectile>;
  spells: Record<string, Spell>;
  keyBinding: Record<string, string>;
}

export interface SpellsAwareState {
  spellsModule: SpellsState;
}

export interface InitializeSpellsPayload {
  projectiles: Record<string, Projectile>;
  spells: Record<string, Spell>;
}

export interface AddProjectilePayload {
  currentLocation: Location,
  projectileId: string,
  spell: string,
}

export interface UpdateProjectilePayload {
  projectileId: string,
  angle: number,
  newLocation: Location,
}

export interface DeleteProjectilePayload {
  projectileId: string,
}