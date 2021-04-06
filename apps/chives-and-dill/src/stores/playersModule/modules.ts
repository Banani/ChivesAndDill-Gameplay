import { playersReducer } from './reducer';
import type { ReducersMapObject } from 'redux';
import { PlayersAwareState } from '../../types/players';
import { IModule } from 'redux-dynamic-modules';

export const PlayersModule: IModule<PlayersAwareState> = {
  id: 'playersModule',
  reducerMap: {
    playersModule: playersReducer,
  } as ReducersMapObject<PlayersAwareState>,
};
