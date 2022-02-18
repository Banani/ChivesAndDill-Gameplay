import type { PlayersAwareState } from '../../types/players';

const getPlayerModule = (state: PlayersAwareState) => state.playersModule;

export const selectCharacterViewsSettings = (state: PlayersAwareState) => getPlayerModule(state).characterViewsSettings;

export const selectActiveTargetId = (state: PlayersAwareState) => getPlayerModule(state).activeTargetId;
