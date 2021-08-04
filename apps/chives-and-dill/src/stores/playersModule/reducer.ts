import type { PlayersState } from '../../types/players';
import type { PlayerAction } from './actions';
import { PlayersActionTypes } from './actions';
import _ from 'lodash';

const defaultViewSettings = (spriteHeight, spriteWidth, image) => ({
   image,
   spriteHeight,
   spriteWidth,
   movementDown: {
      yOffSet: spriteHeight,
      xOffSet: spriteWidth,
      spriteAmount: 8,
   },
   movementRight: {
      yOffSet: spriteHeight * 2,
      xOffSet: spriteWidth,
      spriteAmount: 8,
   },
   movementUp: {
      yOffSet: 0,
      xOffSet: spriteWidth,
      spriteAmount: 8,
   },
   movementLeft: {
      yOffSet: spriteHeight * 3,
      xOffSet: spriteWidth,
      spriteAmount: 8,
   },
   standingDown: {
      yOffSet: spriteHeight,
      xOffSet: 0,
      spriteAmount: 1,
   },
   standingRight: {
      yOffSet: spriteHeight * 2,
      xOffSet: 0,
      spriteAmount: 1,
   },
   standingUp: {
      yOffSet: 0,
      xOffSet: 0,
      spriteAmount: 1,
   },
   standingLeft: {
      yOffSet: spriteHeight * 3,
      xOffSet: 0,
      spriteAmount: 1,
   },
   dead: {
      yOffSet: spriteHeight * 4,
      xOffSet: 0,
      spriteAmount: 1,
   }
});

const initialState: PlayersState = {
   activePlayer: null,
   characters: {},
   areas: [],
   characterViewsSettings: {
      orc: defaultViewSettings(48, 48, '/spritesheets/monsters/orc.png'),
      demon: defaultViewSettings(128, 128, '/spritesheets/monsters/demon.png'),
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
