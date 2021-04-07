import classes from '*.module.css';
import type { PlayersState } from '../../types/players';
import { CharacterDirection } from '../../types/shared';
import { PlayerAction, PlayersActionTypes } from './actions';
import { selectCharacters } from './selectors';

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
    case PlayersActionTypes.PLAYER_CONNECTED:
      return {
        ...state,
        characters: {
          ...state.characters,
          [action.payload.characters.name]: action.payload.characters
        },
      };
    default:
      return state;
  }
};
