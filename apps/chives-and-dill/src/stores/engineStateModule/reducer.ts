import type { EngineStateAction } from './actions';
import { EngineStateActionTypes } from './actions';
import { merge, mapValues, omit } from 'lodash';
import type { GlobalStore} from '@bananos/types';
import { GlobalStoreModule } from '@bananos/types';

const emptyModule = {
   data: {},
   events: [],
};

const initialState: GlobalStore = {
   [GlobalStoreModule.CHARACTER_MOVEMENTS]: emptyModule,
   [GlobalStoreModule.CHARACTER_POWER_POINTS]: emptyModule,
   [GlobalStoreModule.AREA_TIME_EFFECTS]: emptyModule,
   [GlobalStoreModule.PROJECTILE_MOVEMENTS]: emptyModule,
   [GlobalStoreModule.SPELLS]: emptyModule,
   [GlobalStoreModule.SPELL_CHANNELS]: emptyModule,
   [GlobalStoreModule.TIME_EFFECTS]: emptyModule,
   [GlobalStoreModule.POWER_STACKS]: emptyModule,
   [GlobalStoreModule.ABSORB_SHIELDS]: emptyModule,
};

export const engineStateReducer = (state: GlobalStore = initialState, action: EngineStateAction): GlobalStore => {
   switch (action.type) {
      case EngineStateActionTypes.NEW_PACKAGE: {
         return mapValues(
            merge(
               {},
               mapValues(state, (module) => ({ ...module, events: [] })),
               mapValues(action.payload, (module) => ({ data: module.data, events: module.events ?? [] }))
            ),
            (module, key) => ({ ...module, data: omit(module.data, action.payload[key]?.toDelete) })
         );
      }

      default:
         return state;
   }
};
