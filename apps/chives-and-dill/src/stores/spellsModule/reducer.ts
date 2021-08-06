import type { SpellsState } from '../../types/spells';
import type { SpellsAction } from './actions';
import { SpellsActionTypes } from './actions';
import _ from 'lodash';

const initialState: SpellsState = {
   projectiles: {},
   spells: {},
   keyBinding: {},
   areaSpellsEffects: {},
   activeSpellsCasts: {},
   spellShapesToDisplay: [],
   lastSpellLandTimestamp: 0,
};

export const spellsReducer = (state: SpellsState = initialState, action: SpellsAction): SpellsState => {
   switch (action.type) {
      case SpellsActionTypes.INITIALIZE_SPELLS: {
         const keyBinding = {};
         let i = 1;

         Object.keys(action.payload.spells).forEach((key) => {
            keyBinding[i] = key;
            i++;
         });

         return {
            ...state,
            spells: action.payload.spells,
            keyBinding,
         };
      }

      case SpellsActionTypes.ADD_PROJECTILE: {
         return {
            ...state,
            projectiles: {
               ...state.projectiles,
               [action.payload.projectileId]: {
                  angle: action.payload.angle,
                  projectileId: action.payload.projectileId,
                  spell: action.payload.spell,
                  newLocation: action.payload.currentLocation,
               } as any,
            },
         };
      }
      case SpellsActionTypes.UPDATE_PROJECTILE:
         return {
            ...state,
            projectiles: {
               ...state.projectiles,
               [action.payload.projectileId]: {
                  ...state.projectiles[action.payload.projectileId],
                  angle: action.payload.angle,
                  newLocation: action.payload.newLocation,
               },
            },
         };
      case SpellsActionTypes.DELETE_PROJECTILE: {
         return {
            ...state,
            projectiles: _.omit(state.projectiles, action.payload.projectileId),
         };
      }
      case SpellsActionTypes.AREA_SPELL_EFFECT_CREATED: {
         return {
            ...state,
            areaSpellsEffects: {
               ...state.areaSpellsEffects,
               [action.payload.event.areaSpellEffectId]: action.payload.event,
            } as any,
         };
      }
      case SpellsActionTypes.AREA_SPELL_EFFECT_REMOVED: {
         return {
            ...state,
            areaSpellsEffects: _.omit(state.areaSpellsEffects, action.payload.event.areaSpellEffectId),
         };
      }
      case SpellsActionTypes.DELETE_ACTIVE_SPELL_CAST: {
         return {
            ...state,
            activeSpellsCasts: _.omit(state.activeSpellsCasts, action.payload.event.channelId),
         };
      }
      case SpellsActionTypes.ADD_SPELL_LANDED: {
         return {
            ...state,
            spellShapesToDisplay: [...state.spellShapesToDisplay, action.payload.event],
            lastSpellLandTimestamp: Date.now(),
         };
      }

      case SpellsActionTypes.CLEAR_FIRST_LANDED_SPELL: {
         return {
            ...state,
            spellShapesToDisplay: state.spellShapesToDisplay.slice(1),
         };
      }

      case SpellsActionTypes.ADD_ACTIVE_SPELL_CAST: {
         let activeSpellsCasts = state.activeSpellsCasts;

         if (action.payload.event.spell.channelTime) {
            activeSpellsCasts = {
               ...activeSpellsCasts,
               [action.payload.event.casterId]: {
                  castTime: action.payload.event.spell.channelTime,
                  spellCastTimeStamp: Date.now(),
               },
            };
         }

         return {
            ...state,
            activeSpellsCasts,
         };
      }

      default:
         return state;
   }
};
