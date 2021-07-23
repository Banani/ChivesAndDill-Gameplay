import type { PlayersAwareState } from '../../types/players';

const getPlayerModule = (state: PlayersAwareState) => state.playersModule;

export const selectCharacters = (state: PlayersAwareState) =>
  getPlayerModule(state).characters;

export const selectAreas = (state: PlayersAwareState) =>
  getPlayerModule(state).areas;

export const selectActivePlayer = (state: PlayersAwareState) =>
  getPlayerModule(state).activePlayer;

export const selectCharacterViewsSettings = (state: PlayersAwareState) =>
  getPlayerModule(state).characterViewsSettings;

export const selectProjectiles = (state: PlayersAwareState) =>
  getPlayerModule(state).projectiles;

export const selectSpells = (state: PlayersAwareState) =>
  getPlayerModule(state).spells;

export const selectKeyBinds = (state: PlayersAwareState) =>
  getPlayerModule(state).keyBinding;
  
