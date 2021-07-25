import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux-dynamic-modules-core';
import type { IModuleStore } from 'redux-dynamic-modules-core';
import { PlayersModule, SpellsModule } from '../stores';
import SocketCommunicator from "./gameController/socketCommunicator";
import GameController from './gameController/gameController';
import Map from './map';

const store: IModuleStore<unknown> = createStore(
  {
    initialState: {},
    extensions: [],
  },
  PlayersModule,
  SpellsModule
);

export default function App() {
  return (
    <Provider store={store}>
      <SocketCommunicator>
        <GameController>
          <Map />
        </GameController>
      </SocketCommunicator>
    </Provider>
  );
}
