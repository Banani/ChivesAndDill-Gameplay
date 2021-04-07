import classes from '*.module.css';
import type { PlayersState } from '../../types/players';
import { CharacterDirection } from '../../types/shared';
import { PlayerAction, PlayersActionTypes } from './actions';

const initialState: PlayersState = {
  characters: {
    '1': {
      name: 'player_1',
      location: { x: 0, y: 0 },
      direction: CharacterDirection.LEFT,
      image: 'http://localhost:4200/assets/spritesheets/player1.png',
    },
    '2': {
      name: 'player_2',
      location: { x: 50, y: 150 },
      direction: CharacterDirection.LEFT,
      image: 'http://localhost:4200/assets/spritesheets/teemo.png',
    },
    '3': {
      name: 'player_3',
      location: { x: 200, y: 300 },
      direction: CharacterDirection.LEFT,
      image: 'http://localhost:4200/assets/spritesheets/orianna.png',
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
    case PlayersActionTypes.INITIALIZE_CHARACTERS:
      return {
        ...state,
        characters: action.payload.characters,
      };
    default:
      return state;
  }
};
