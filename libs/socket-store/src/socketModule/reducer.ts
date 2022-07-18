import type { EngineStateAction } from './actions';
import { EngineStateActionTypes } from './actions';
import { merge, mapValues, omit, forEach, clone, pickBy } from 'lodash';
import { Module } from './types';

const emptyModule: Module = {
   data: {},
   events: [],
};

const initialState = {};

const deleteRequestedFields = (data: any, pathToDelete: any) => {
   forEach(pathToDelete, (toDelete, key) => {
      if (toDelete === null) {
         delete data[key];
      } else {
         deleteRequestedFields(data[key], toDelete);
      }
   });
};

export const engineStateReducer = (state = initialState, action: EngineStateAction): Record<string, any> => {
   switch (action.type) {
      case EngineStateActionTypes.NEW_PACKAGE: {
         let newState: Record<string, Module> = clone(state);

         forEach(newState, (module: Module) => {
            module.events = [];
         });

         forEach(action.payload, (module: Module, moduleName: string) => {
            if (!newState[moduleName]) {
               newState[moduleName] = emptyModule;
            }

            if (module.events) {
               newState[moduleName].events = module.events;
            }
         });

         newState = merge(
            {},
            newState,
            mapValues(
               pickBy(action.payload, (module) => module.data),
               (module) => ({ data: module.data })
            )
         );

         forEach(
            pickBy(action.payload, (module) => module.toDelete),
            (module, moduleName) => deleteRequestedFields(newState[moduleName].data, module.toDelete)
         );

         return newState;
      }

      default:
         return state;
   }
};
