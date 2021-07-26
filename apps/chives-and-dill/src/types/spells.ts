import type { Spell, Projectile, Location } from '@bananos/types';

export interface SpellsState {
  projectiles: Record<string, Projectile>;
  spells: Record<string, Spell>;
  keyBinding: Record<string, string>;
  areaSpellsEffects: Record<string, AreaSpellEffectCreatedPayload>
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

export interface AreaSpellEffectCreatedPayload {
  event: {
    areaSpellEffectId: string,
    effect: {
      type: string,
      attackFrequency: number,
      areaType: string,
      radius: number,
      period: number,
      spellEffects: Record<string, SpellEffects>[]
    },
    location: Location,
  }
}

export interface SpellEffects {
  type: string,
  amount: number,
}

export interface AreaSpellEffectRemovedPayload {
  event: {
    areaSpellEffectId: string,
  }
}