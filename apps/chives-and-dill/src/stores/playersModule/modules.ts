import { playersReducer } from './reducer';
import type { ReducersMapObject } from 'redux';
import type { PlayersAwareState } from '../../types/players';
import type { IModule } from 'redux-dynamic-modules';

export const PlayersModule: IModule<PlayersAwareState> = {
  id: 'playersModule',
  reducerMap: {
    playersModule: playersReducer,
  } as ReducersMapObject<PlayersAwareState>,
};
