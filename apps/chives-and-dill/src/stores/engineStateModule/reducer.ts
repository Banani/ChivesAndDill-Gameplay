import { EngineStateAction, EngineStateActionTypes } from './actions';
import { merge, mapValues, omit } from 'lodash';
import { GlobalStore } from '@bananos/types';

const initialState: any = {};

export const engineStateReducer = (state: GlobalStore = initialState, action: EngineStateAction): GlobalStore => {
   switch (action.type) {
      case EngineStateActionTypes.NEW_PACKAGE: {
         return mapValues(
            merge(
               state,
               mapValues(action.payload, (module) => module.data)
            ),
            (module, key) => omit(module, action.payload[key].toDelete)
         );
      }

      default:
         return state;
   }
};
