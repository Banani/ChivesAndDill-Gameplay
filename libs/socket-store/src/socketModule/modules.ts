import { engineStateReducer } from './reducer';
import type { ReducersMapObject } from 'redux';
import type { IModule } from 'redux-dynamic-modules';
import type { SocketAwareState } from './types';

export const SocketModule: IModule<SocketAwareState> = {
   id: 'socketStateModule',
   reducerMap: {
      socketStateModule: engineStateReducer,
   } as ReducersMapObject<SocketAwareState>,
};
