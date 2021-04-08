import type { PlayersState } from '../../types/players';
import { PlayerAction, PlayersActionTypes } from './actions';

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
    default:
      return state;
  }
};
