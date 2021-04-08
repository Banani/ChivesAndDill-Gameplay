import type { PlayersState } from '../../types/players';
import { PlayerAction, PlayersActionTypes } from './actions';
import _ from 'lodash';
import omit from 'lodash.omit';

const initialState: PlayersState = {
  characters: {},
};

export const playersReducer = (
  state: PlayersState = initialState,
  action: PlayerAction
): PlayersState => {
  switch (action.type) {
    case PlayersActionTypes.CHANGE_PLAYER_POSITION:
      return {
        ...state,
        characters: {
          ...state.characters,
          [action.payload.selectedPlayerId]: {
            ...state.characters[action.payload.selectedPlayerId],
            location: action.payload.newLocation,
          },
        },
      };
    case PlayersActionTypes.INITIALIZE_CHARACTERS:
      return {
        ...state,
        characters: action.payload.characters,
      };
    case PlayersActionTypes.ADD_PLAYER:
      return {
        ...state,
        characters: {
          ...state.characters,
          [action.payload.player.id]: action.payload.player,
        },
      };
    case PlayersActionTypes.DELETE_PLAYER:
      return {
        ...state,
        characters: _.omit(state.characters, action.payload.userId),
      };
    default:
      return state;
  }
};
