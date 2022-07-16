import { engineStateReducer } from './reducer';
import type { ReducersMapObject } from 'redux';
import type { IModule } from 'redux-dynamic-modules';
import type { EngineAwareState } from './types';

export const EngineStateModule: IModule<EngineAwareState> = {
   id: 'engineStateModule',
   reducerMap: {
      engineStateModule: engineStateReducer,
   } as ReducersMapObject<EngineAwareState>,
};
