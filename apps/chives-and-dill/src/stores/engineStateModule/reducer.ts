import type { GlobalStore } from '@bananos/types';
import { GlobalStoreModule } from '@bananos/types';
import { clone, forEach, mapValues, merge, pickBy } from 'lodash';
import type { EngineStateAction } from './actions';
import { EngineStateActionTypes } from './actions';

const emptyModule = {
   data: {},
   events: [],
};

const initialState: GlobalStore = {
   [GlobalStoreModule.CHARACTER_MOVEMENTS]: emptyModule,
   [GlobalStoreModule.PROJECTILE_MOVEMENTS]: emptyModule,
   [GlobalStoreModule.SPELL_CHANNELS]: emptyModule,
   [GlobalStoreModule.CHARACTER_POWER_POINTS]: emptyModule,
   [GlobalStoreModule.TIME_EFFECTS]: emptyModule,
   [GlobalStoreModule.AREA_TIME_EFFECTS]: emptyModule,
   [GlobalStoreModule.SPELLS]: emptyModule,
   [GlobalStoreModule.POWER_STACKS]: emptyModule,
   [GlobalStoreModule.ABSORB_SHIELDS]: emptyModule,
   [GlobalStoreModule.PLAYER]: emptyModule,
   [GlobalStoreModule.CHARACTER]: emptyModule,
   [GlobalStoreModule.ACTIVE_CHARACTER]: emptyModule,
   [GlobalStoreModule.AREAS]: emptyModule,
   [GlobalStoreModule.MAP_SCHEMA]: emptyModule,
   [GlobalStoreModule.ACTIVE_LOOT]: emptyModule,
   [GlobalStoreModule.ERROR_MESSAGES]: emptyModule,
   [GlobalStoreModule.CHAT_CHANNEL]: emptyModule,
   [GlobalStoreModule.CHAT_MESSAGES]: emptyModule,
   [GlobalStoreModule.EXPERIENCE]: emptyModule,
   [GlobalStoreModule.CURRENCY]: emptyModule,
   [GlobalStoreModule.BACKPACK_SCHEMA]: emptyModule,
   [GlobalStoreModule.BACKPACK_ITEMS]: emptyModule,
   [GlobalStoreModule.ITEMS]: emptyModule,
   [GlobalStoreModule.NPC_CONVERSATION]: emptyModule,
   [GlobalStoreModule.NPC_STOCK]: emptyModule,
   [GlobalStoreModule.QUEST_DEFINITION]: emptyModule,
   [GlobalStoreModule.NPC_QUESTS]: emptyModule,
   [GlobalStoreModule.QUEST_PROGRESS]: emptyModule,
   [GlobalStoreModule.CORPSE_DROP]: emptyModule,
};

const deleteRequestedFields = (data: any, pathToDelete: any) => {
   forEach(pathToDelete, (toDelete, key) => {
      if (toDelete === null) {
         delete data[key];
      } else {
         deleteRequestedFields(data[key], toDelete);
      }
   });
};

export const engineStateReducer = (state: GlobalStore = initialState, action: EngineStateAction): GlobalStore => {
   switch (action.type) {
      case EngineStateActionTypes.NEW_PACKAGE: {
         let newState = clone(state);

         forEach(newState, (module) => {
            module.events = [];
         });

         forEach(action.payload, (module, moduleName) => {
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
