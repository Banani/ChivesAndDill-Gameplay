import React from 'react';
import { Provider } from 'react-redux';
import type { IModuleStore } from 'redux-dynamic-modules-core';
import { createStore } from 'redux-dynamic-modules-core';
import { EngineApi } from '../contexts/EngineApi';
import { KeyBoardContextProvider } from '../contexts/KeyBoardContext';
import { ModalsManagerContextProvider } from '../contexts/ModalsManagerContext';
import { PackageContextProvider } from '../contexts/PackageContext';
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
               <KeyBoardContextProvider>
                  <ModalsManagerContextProvider>
                     <EngineApi>
                        <Game />
                     </EngineApi>
                  </ModalsManagerContextProvider>
               </KeyBoardContextProvider>
            </SocketCommunicator>
         </Provider>
      </PackageContextProvider>
   );
}
