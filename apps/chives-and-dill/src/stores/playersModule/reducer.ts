import type { PlayersState } from '../../types/players';
import { CharacterDirection } from '../../types/shared';
import { PlayerAction, PlayersActionTypes } from './actions';

const initialState: PlayersState = {
  characters: {
    '1': {
      name: 'player_1',
      location: { x: 0, y: 0 },
      direction: CharacterDirection.LEFT,
    },
  },
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
    default:
      return state;
  }
};
