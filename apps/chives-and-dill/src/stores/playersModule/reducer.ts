import type { PlayersState } from '../../types/players';
import type { PlayerAction } from './actions';
import { PlayersActionTypes } from './actions';
import _ from 'lodash';

const initialState: PlayersState = {
  characters: {},
  areas: [],
  projectiles: {},
  quests: {},
  characterViewsSettings: {
    nakedFemale: {
      spriteHeight: 48,
      spriteWidth: 28,
      image: '/spritesheets/player/femalePlayer.png',
      movementDown: {
        yOffSet: 96,
        xOffSet: 28,
        spriteAmount: 8,
      },
      movementRight: {
        yOffSet: 144,
        xOffSet: 28,
        spriteAmount: 8,
      },
      movementUp: {
        yOffSet: 0,
        xOffSet: 28,
        spriteAmount: 8,
      },
      movementLeft: {
        yOffSet: 48,
        xOffSet: 28,
        spriteAmount: 8,
      },
      standingDown: {
        yOffSet: 96,
        xOffSet: 0,
        spriteAmount: 1,
      },
      standingRight: {
        yOffSet: 144,
        xOffSet: 0,
        spriteAmount: 1,
      },
      standingUp: {
        yOffSet: 0,
        xOffSet: 0,
        spriteAmount: 1,
      },
      standingLeft: {
        yOffSet: 48,
        xOffSet: 0,
        spriteAmount: 1,
      },
      dead: {
        yOffSet: 192,
        xOffSet: 0,
        spriteAmount: 1,
      }
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
      dead: {
        yOffSet: 204,
        xOffSet: 0,
        spriteAmount: 1,
      }
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
    case PlayersActionTypes.ADD_SPELL: {
      return {
        ...state,
        projectiles: {
          ...state.projectiles,
          [action.payload.projectileId]: {
            spell: action.payload.spell,
            newLocation: action.payload.currentLocation,
          }
        },
      };
    }
    case PlayersActionTypes.UPDATE_SPELL:
      return {
        ...state,
        projectiles: {
          ...state.projectiles,
          [action.payload.projectileId]: {
            ...state.projectiles[action.payload.projectileId],
            angle: action.payload.angle,
            newLocation: action.payload.newLocation,
          }
        },
      }
    case PlayersActionTypes.DELETE_PROJECTILE:
      return {
        ...state,
        projectiles: _.omit(state.projectiles, action.payload.projectileId),
      };
    case PlayersActionTypes.UPDATE_CHARACTER_HP:
      return {
        ...state,
        characters: {
          ...state.characters,
          [action.payload.characterId]: {
            ...state.characters[action.payload.characterId],
            currentHp: state.characters[action.payload.characterId].currentHp - action.payload.amount,
            hpLost: action.payload.amount,
          }
        }
      };
    case PlayersActionTypes.CHARACTER_DIED:
      return {
        ...state,
        characters: {
          ...state.characters,
          [action.payload.characterId]: {
            ...state.characters[action.payload.characterId],
            isDead: true
          }
        }
      };
    case PlayersActionTypes.QUEST_STARTED:
      return {
        ...state,
        quests: {
          ...state.quests,
          [action.payload.questTemplate.id]: action.payload.questTemplate,
        },
      }
      case PlayersActionTypes.QUEST_COMPLETED: 
        return {
          ...state,
          quests: _.omit(state.quests, action.payload.questId),
        };
    default:
      return state;
  }
};
