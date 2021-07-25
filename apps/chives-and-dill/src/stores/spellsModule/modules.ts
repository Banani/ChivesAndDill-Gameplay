import { spellsReducer } from './reducer';
import type { ReducersMapObject } from 'redux';
import type { SpellsAwareState } from '../../types/spells';
import type { IModule } from 'redux-dynamic-modules';

export const SpellsModule: IModule<SpellsAwareState> = {
  id: 'spellsModule',
  reducerMap: {
    spellsModule: spellsReducer,
  } as ReducersMapObject<SpellsAwareState>,
};
