import React from 'react';
import { io } from 'socket.io-client';
import { Provider } from 'react-redux';
import { createStore } from 'redux-dynamic-modules-core';
import type { IModuleStore } from 'redux-dynamic-modules-core';
import { PlayersModule } from '../stores';
import SocketContext from "./gameController/socketContext";
import GameController from './gameController/gameController';
import Map from './map';

const URL = 'http://localhost:3000';
const socket = io(URL, { autoConnect: true });

socket.on('connect', () => {
  console.log(123);
  socket.emit('test');
  socket.emit('test');
});

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
      <SocketContext>
        <GameController>
          <Map />
        </GameController>
      </SocketContext>
    </Provider>
  );
}
