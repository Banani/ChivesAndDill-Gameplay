import type { EngineStateAction } from './actions';
import { EngineStateActionTypes } from './actions';
import { merge, mapValues, omit } from 'lodash';
import { GlobalStore, GlobalStoreModule } from '@bananos/types';

const emptyModule = {
   data: {},
   events: {},
};

const initialState: GlobalStore = {
   [GlobalStoreModule.CHARACTER_MOVEMENTS]: emptyModule,
   [GlobalStoreModule.CHARACTER_POWER_POINTS]: emptyModule,
   [GlobalStoreModule.AREA_TIME_EFFECTS]: emptyModule,
   [GlobalStoreModule.PROJECTILE_MOVEMENTS]: emptyModule,
   [GlobalStoreModule.SPELLS]: emptyModule,
   [GlobalStoreModule.SPELL_CHANNELS]: emptyModule,
   [GlobalStoreModule.TIME_EFFECTS]: emptyModule,
};

export const engineStateReducer = (state: GlobalStore = initialState, action: EngineStateAction): GlobalStore => {
   switch (action.type) {
      case EngineStateActionTypes.NEW_PACKAGE: {
         return mapValues(
            merge(
               {},
               state,
               mapValues(action.payload, (module) => ({ data: module.data, events: module.events ?? {} }))
            ),
            (module, key) => {
               return { ...module, data: omit(module.data, action.payload[key]?.toDelete) };
            }
         );
      }

      case EngineStateActionTypes.CLEAR_EVENT: {
         return {
            ...state,
            [action.payload.module]: {
               ...state[action.payload.module],
               events: omit(state[action.payload.module].events, [action.payload.eventId]),
            },
         };
      }

      default:
         return state;
   }
};
