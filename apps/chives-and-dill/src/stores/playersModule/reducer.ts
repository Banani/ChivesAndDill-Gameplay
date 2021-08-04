import type { PlayersState } from '../../types/players';
import type { PlayerAction } from './actions';
import { PlayersActionTypes } from './actions';
import _ from 'lodash';

const initialState: PlayersState = {
   activePlayer: null,
   characters: {},
   areas: [],
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
         },
      },
      orc: {
         spriteHeight: 48,
         spriteWidth: 48,
         image: '/spritesheets/monsters/orc.png',
         movementDown: {
            yOffSet: 48,
            xOffSet: 48,
            spriteAmount: 8,
         },
         movementRight: {
            yOffSet: 96,
            xOffSet: 48,
            spriteAmount: 8,
         },
         movementUp: {
            yOffSet: 0,
            xOffSet: 48,
            spriteAmount: 8,
         },
         movementLeft: {
            yOffSet: 144,
            xOffSet: 48,
            spriteAmount: 8,
         },
         standingDown: {
            yOffSet: 48,
            xOffSet: 0,
            spriteAmount: 1,
         },
         standingRight: {
            yOffSet: 96,
            xOffSet: 0,
            spriteAmount: 1,
         },
         standingUp: {
            yOffSet: 0,
            xOffSet: 0,
            spriteAmount: 1,
         },
         standingLeft: {
            yOffSet: 144,
            xOffSet: 0,
            spriteAmount: 1,
         },
         dead: {
            yOffSet: 192,
            xOffSet: 0,
            spriteAmount: 1,
         },
      },
      demon: {
         spriteHeight: 128,
         spriteWidth: 128,
         image: '/spritesheets/monsters/demon.png',
         movementDown: {
            yOffSet: 128,
            xOffSet: 128,
            spriteAmount: 8,
         },
         movementRight: {
            yOffSet: 128 * 2,
            xOffSet: 128,
            spriteAmount: 8,
         },
         movementUp: {
            yOffSet: 0,
            xOffSet: 128,
            spriteAmount: 8,
         },
         movementLeft: {
            yOffSet: 128 * 3,
            xOffSet: 128,
            spriteAmount: 8,
         },
         standingDown: {
            yOffSet: 128,
            xOffSet: 0,
            spriteAmount: 1,
         },
         standingRight: {
            yOffSet: 128 * 2,
            xOffSet: 0,
            spriteAmount: 1,
         },
         standingUp: {
            yOffSet: 0,
            xOffSet: 0,
            spriteAmount: 1,
         },
         standingLeft: {
            yOffSet: 128 * 3,
            xOffSet: 0,
            spriteAmount: 1,
         },
         dead: {
            yOffSet: 128 * 4,
            xOffSet: 0,
            spriteAmount: 1,
         },
      },
   },
};

export const playersReducer = (state: PlayersState = initialState, action: PlayerAction): PlayersState => {
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
      case PlayersActionTypes.INITIALIZE_PLAYERS:
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
      case PlayersActionTypes.UPDATE_CHARACTER_HP:
         return {
            ...state,
            characters: {
               ...state.characters,
               [action.payload.characterId]: {
                  ...state.characters[action.payload.characterId],
                  currentHp: action.payload.currentHp,
                  hpLost: action.payload.amount,
                  spellEffect: action.payload.spellEffect,
               },
            },
         };
      case PlayersActionTypes.UPDATE_CHARACTER_SPELL_POWER:
         return {
            ...state,
            characters: {
               ...state.characters,
               [action.payload.characterId]: {
                  ...state.characters[action.payload.characterId],
                  currentSpellPower: action.payload.currentSpellPower,
               },
            },
         };
      case PlayersActionTypes.CHARACTER_DIED:
         return {
            ...state,
            characters: {
               ...state.characters,
               [action.payload.characterId]: {
                  ...state.characters[action.payload.characterId],
                  isDead: true,
               },
            },
         };
      default:
         return state;
   }
};
