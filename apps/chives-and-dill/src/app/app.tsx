import React from 'react';
import { Provider } from 'react-redux';
import type { IModuleStore } from 'redux-dynamic-modules-core';
import { createStore } from 'redux-dynamic-modules-core';
import { ItemsApi } from '../contexts/ItemsApi';
import { PackageContextProvider } from '../contexts/packageContext';
import { PlayersModule, QuestsModule, SpellsModule } from '../stores';
import { Game } from './game';
import SocketCommunicator from './gameController/socketCommunicator';

const store: IModuleStore<any> = createStore(
   {
      initialState: {},
      extensions: [],
   },
   PlayersModule,
   QuestsModule,
   SpellsModule
);

export default function App() {
   return (
      <PackageContextProvider>
         <Provider store={store}>
            <SocketCommunicator>
               <ItemsApi>
                  <Game />
               </ItemsApi>
            </SocketCommunicator>
         </Provider>
      </PackageContextProvider>
   );
}
