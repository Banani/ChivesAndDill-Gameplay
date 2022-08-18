import React from 'react';
import { Provider } from 'react-redux';
import type { IModuleStore } from 'redux-dynamic-modules-core';
import { createStore } from 'redux-dynamic-modules-core';
import { EngineApi } from '../contexts/EngineApi';
import { PackageContextProvider } from '../contexts/packageContext';
import { PlayersModule, SpellsModule } from '../stores';
import { Game } from './game';
import SocketCommunicator from './gameController/socketCommunicator';

const store: IModuleStore<any> = createStore(
   {
      initialState: {},
      extensions: [],
   },
   PlayersModule,
   SpellsModule
);

export default function App() {
   return (
      <PackageContextProvider>
         <Provider store={store}>
            <SocketCommunicator>
               <EngineApi>
                  <Game />
               </EngineApi>
            </SocketCommunicator>
         </Provider>
      </PackageContextProvider>
   );
}
