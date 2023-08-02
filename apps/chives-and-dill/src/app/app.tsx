import React from 'react';
import { Provider } from 'react-redux';
import type { IModuleStore } from 'redux-dynamic-modules-core';
import { createStore } from 'redux-dynamic-modules-core';
import { ContextMenu } from '../components';
import { EngineApi } from '../contexts/EngineApi';
import { ItemTemplateContextProvider } from '../contexts/ItemTemplateContext';
import { KeyBoardContextProvider } from '../contexts/KeyBoardContext';
import { MenuContextProvider } from '../contexts/MenuContext';
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
        <KeyBoardContextProvider>
            <PackageContextProvider>
                <Provider store={store}>
                    <SocketCommunicator>
                        <MenuContextProvider>
                            <>
                                <ContextMenu />
                                <EngineApi>
                                    <ItemTemplateContextProvider>
                                        <Game />
                                    </ItemTemplateContextProvider>
                                </EngineApi>
                            </>
                        </MenuContextProvider>
                    </SocketCommunicator>
                </Provider>
            </PackageContextProvider>
        </KeyBoardContextProvider>
    );
}
