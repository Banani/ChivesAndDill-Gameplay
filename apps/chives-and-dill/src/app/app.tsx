import React from 'react';
import { ContextMenu } from '../components';
import { EngineApi } from '../contexts/EngineApiContext';
import { GameController } from '../contexts/GameController';
import { ItemTemplateContextProvider } from '../contexts/ItemTemplateContext';
import { KeyBoardContextProvider } from '../contexts/KeyBoardContext';
import { MenuContextProvider } from '../contexts/MenuContext';
import { PackageContextProvider } from '../contexts/PackageContext';
import { Game } from './game';

export default function App() {
    return (
        <KeyBoardContextProvider>
            <PackageContextProvider>
                <EngineApi>
                    <MenuContextProvider>
                        <ContextMenu />
                        <GameController>
                            <ItemTemplateContextProvider>
                                <Game />
                            </ItemTemplateContextProvider>
                        </GameController>
                    </MenuContextProvider>
                </EngineApi>
            </PackageContextProvider>
        </KeyBoardContextProvider>
    );
}