import { PlayersAwareState } from '../../types/players';

const getPlayerModule = (state: PlayersAwareState) => state.playersModule;

export const selectCharacters = (state: PlayersAwareState) =>
  getPlayerModule(state).characters;
