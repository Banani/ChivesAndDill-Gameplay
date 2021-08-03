import { questsReducer } from './reducer';
import type { ReducersMapObject } from 'redux';
import type { QuestsAwareState } from '../../types/quests';
import type { IModule } from 'redux-dynamic-modules';

export const PlayersModule: IModule<QuestsAwareState> = {
  id: 'playersModule',
  reducerMap: {
    questsModule: questsReducer,
  } as ReducersMapObject<QuestsAwareState>,
};
