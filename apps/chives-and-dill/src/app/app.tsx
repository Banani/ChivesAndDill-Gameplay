import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux-dynamic-modules-core';
import type { IModuleStore } from 'redux-dynamic-modules-core';
import { PlayersModule } from '../stores';
import { ReduxDemo } from './ReduxDemo';
import Map from './map';

const store: IModuleStore<unknown> = createStore(
  {
    initialState: {},
    extensions: [],
  },
  PlayersModule
);

export default function App() {
  return (
    <Provider store={store}>
      <Map />
      <ReduxDemo />
    </Provider>
  );
}
