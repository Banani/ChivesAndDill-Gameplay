import type { EngineStateAction } from './actions';
import { EngineStateActionTypes } from './actions';
import { merge, mapValues, omit } from 'lodash';
import type { GlobalStore } from '@bananos/types';

const emptyModule = {
   data: {},
   events: {},
};

const initialState: GlobalStore = {
   characterMovements: emptyModule,
   projectileMovements: emptyModule,
   spellChannels: emptyModule,
   characterPowerPoints: emptyModule,
   timeEffects: emptyModule,
   areaTimeEffects: emptyModule,
   spells: emptyModule,
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

      default:
         return state;
   }
};
