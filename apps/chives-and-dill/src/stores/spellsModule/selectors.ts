import type { SpellsAwareState } from '../../types/spells';

const getSpellsModule = (state: SpellsAwareState) => state.spellsModule;

export const selectProjectiles = (state: SpellsAwareState) =>
  getSpellsModule(state).projectiles;

export const selectSpells = (state: SpellsAwareState) =>
  getSpellsModule(state).spells;

export const selectKeyBinds = (state: SpellsAwareState) =>
  getSpellsModule(state).keyBinding;
  
