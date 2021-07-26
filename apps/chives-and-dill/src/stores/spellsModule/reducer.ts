import type { SpellsState } from '../../types/spells';
import type { SpellsAction } from './actions';
import { SpellsActionTypes } from './actions';
import _ from 'lodash';

const initialState: SpellsState = {
  projectiles: {},
  spells: {},
  keyBinding: {
    "1": "DirectHit",
    "2": "Projectile",
    "3": "InstantProjectile",
  },
  areaSpellsEffects: {},
};

export const spellsReducer = (
  state: SpellsState = initialState,
  action: SpellsAction
): SpellsState => {
  switch (action.type) {
    case SpellsActionTypes.INITIALIZE_SPELLS:
      return {
        ...state,
        spells: action.payload.spells,
      };
    case SpellsActionTypes.ADD_PROJECTILE: {
      return {
        ...state,
        projectiles: {
          ...state.projectiles,
          [action.payload.projectileId]: {
            projectileId: action.payload.projectileId,
            spell: action.payload.spell,
            newLocation: action.payload.currentLocation,
          }
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
          }
        },
      }
    case SpellsActionTypes.DELETE_PROJECTILE:
      return {
        ...state,
        projectiles: _.omit(state.projectiles, action.payload.projectileId),
      };
    case SpellsActionTypes.AREA_SPELL_EFFECT_CREATED:
      return {
        ...state,
        areaSpellsEffects: {
          ...state.areaSpellsEffects,
          [action.payload.event.areaSpellEffectId]: action.payload.event,
        },
      };
    case SpellsActionTypes.AREA_SPELL_EFFECT_REMOVED: {
      console.log(state, action.payload, _.omit(state.areaSpellsEffects, action.payload.event.areaSpellEffectId));
      return {
        ...state,
        areaSpellsEffects: _.omit(state.areaSpellsEffects, action.payload.event.areaSpellEffectId),
    };
    }
      
    default:
      return state;
  }
};
