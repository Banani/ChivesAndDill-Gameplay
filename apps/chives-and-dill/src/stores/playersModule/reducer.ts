import type { PlayersState } from '../../types/players';
import { PlayerAction, PlayersActionTypes } from './actions';
import _ from 'lodash';

const initialState: PlayersState = {
  characters: {},
  areas: [],
  characterViewsSettings: {
    nakedFemale: {
      spriteHeight: 64,
      spriteWidth: 64,
      image: '/spritesheets/player/femalePlayer.png',
      movementDown: {
        yOffSet: 128,
        xOffSet: 64,
        spriteAmount: 8,
      },
      movementRight: {
        yOffSet: 192,
        xOffSet: 64,
        spriteAmount: 8,
      },
      movementUp: {
        yOffSet: 0,
        xOffSet: 64,
        spriteAmount: 8,
      },
      movementLeft: {
        yOffSet: 64,
        xOffSet: 64,
        spriteAmount: 8,
      },
      standingDown: {
        yOffSet: 128,
        xOffSet: 0,
        spriteAmount: 1,
      },
      standingRight: {
        yOffSet: 192,
        xOffSet: 0,
        spriteAmount: 1,
      },
      standingUp: {
        yOffSet: 0,
        xOffSet: 0,
        spriteAmount: 1,
      },
      standingLeft: {
        yOffSet: 64,
        xOffSet: 0,
        spriteAmount: 1,
      },
    },
    pigMan: {
      spriteHeight: 51,
      spriteWidth: 36,
      image: '/spritesheets/monsters/pigMan.png',
      movementDown: {
        yOffSet: 0,
        xOffSet: 0,
        spriteAmount: 3,
      },
      movementRight: {
        yOffSet: 102,
        xOffSet: 0,
        spriteAmount: 3,
      },
      movementUp: {
        yOffSet: 153,
        xOffSet: 0,
        spriteAmount: 3,
      },
      movementLeft: {
        yOffSet: 51,
        xOffSet: 0,
        spriteAmount: 3,
      },
      standingDown: {
        yOffSet: 0,
        xOffSet: 0,
        spriteAmount: 1,
      },
      standingRight: {
        yOffSet: 102,
        xOffSet: 0,
        spriteAmount: 1,
      },
      standingUp: {
        yOffSet: 153,
        xOffSet: 0,
        spriteAmount: 1,
      },
      standingLeft: {
        yOffSet: 51,
        xOffSet: 0,
        spriteAmount: 1,
      },
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
            direction: action.payload.newDirection,
          },
        },
      };
    case PlayersActionTypes.INITIALIZE:
      return {
        ...state,
        activePlayer: action.payload.activePlayer,
        characters: action.payload.characters,
        areas: action.payload.areas,
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
    case PlayersActionTypes.CHANGE_PLAYER_MOVING_STATUS:
      return {
        ...state,
        characters: {
          ...state.characters,
          [action.payload.userId]: {
            ...state.characters[action.payload.userId],
            isInMove: action.payload.isInMove,
          },
        },
      };
    default:
      return state;
  }
};
