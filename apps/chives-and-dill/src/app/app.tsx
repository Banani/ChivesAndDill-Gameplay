import React from 'react';
import { ContextMenu } from '../components';
import { EngineApi } from '../contexts/EngineApi';
import { GameController } from '../contexts/GameController';
import { ItemTemplateContextProvider } from '../contexts/ItemTemplateContext';
import { KeyBoardContextProvider } from '../contexts/KeyBoardContext';
import { MenuContextProvider } from '../contexts/MenuContext';
import { PackageContextProvider } from '../contexts/PackageContext';
import { SocketCommunicator } from '../contexts/SocketCommunicator';
import { Game } from './game';

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
