import type { SpellsState } from '../../types/spells';
import type { SpellsAction } from './actions';
import { SpellsActionTypes } from './actions';
import _, { forEach } from 'lodash';

const initialState: SpellsState = {
   projectiles: {},
   spells: {},
   keyBinding: {},
   areaSpellsEffects: {},
   activeSpellsCasts: {},
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
                  projectileId: action.payload.projectileId,
                  spell: action.payload.spell,
                  newLocation: action.payload.currentLocation,
               },
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
            },
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

      case SpellsActionTypes.ADD_ACTIVE_SPELL_CAST:
         if (action.payload.event.spell.channelTime) {
            return {
               ...state,
               activeSpellsCasts: {
                  ...state.activeSpellsCasts,
                  [action.payload.event.casterId]: {
                     castTime: action.payload.event.spell.channelTime,
                     spellCastTimeStamp: Date.now(),
                  },
               },
            };
         }
      default:
         return state;
   }
};
