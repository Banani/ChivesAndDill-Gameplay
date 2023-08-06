import React from 'react';
import { ContextMenu } from '../components';
import { EngineApi } from '../contexts/EngineApi';
import { ItemTemplateContextProvider } from '../contexts/ItemTemplateContext';
import { KeyBoardContextProvider } from '../contexts/KeyBoardContext';
import { MenuContextProvider } from '../contexts/MenuContext';
import { PackageContextProvider } from '../contexts/PackageContext';
import { Game } from './game';
import { GameController } from './gameController/gameController';
import { SocketCommunicator } from './gameController/socketCommunicator';

export default function App() {
    return (
        <KeyBoardContextProvider>
            <PackageContextProvider>
                <SocketCommunicator>
                    <MenuContextProvider>
                        <>
                            <ContextMenu />
                            <EngineApi>
                                <GameController>
                                    <ItemTemplateContextProvider>
                                        <Game />
                                    </ItemTemplateContextProvider>
                                </GameController>
                            </EngineApi>
                        </>
                    </MenuContextProvider>
                </SocketCommunicator>
            </PackageContextProvider>
        </KeyBoardContextProvider>
    );
}
