import React from 'react';
import { Provider } from 'react-redux';
import type { IModuleStore } from 'redux-dynamic-modules-core';
import { createStore } from 'redux-dynamic-modules-core';
import { ItemsApi } from '../contexts/ItemsApi';
import { EngineStateModule, PlayersModule, QuestsModule, SpellsModule } from '../stores';
import { EngineAwareState } from '../stores/engineStateModule/types';
import { Game } from './game';
import SocketCommunicator from './gameController/socketCommunicator';

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
            <ItemsApi>
               <Game />
            </ItemsApi>
         </SocketCommunicator>
      </Provider>
   );
}
