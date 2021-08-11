import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux-dynamic-modules-core';
import type { IModuleStore } from 'redux-dynamic-modules-core';
import { PlayersModule, SpellsModule, QuestsModule, EngineStateModule } from '../stores';
import SocketCommunicator from './gameController/socketCommunicator';
import GameController from './gameController/gameController';
import Map from './map';
import { EngineAwareState } from '../stores/engineStateModule/types';

const store: IModuleStore<EngineAwareState> = createStore(
   {
      initialState: {},
      extensions: [],
   },
   PlayersModule,
   QuestsModule,
   SpellsModule,
   EngineStateModule
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
