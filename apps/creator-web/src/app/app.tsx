// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CssBaseline, Toolbar } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { KeyBoardContextProvider, PackageContext, PackageContextProvider, SocketCommunicator } from './contexts';
import { DialogProvider } from './contexts/dialogContext';
import { AllDialogs } from './dialogs';
import { Items, MapEditor, NpcPanel, Quests } from './views';
import { MapContextProvider } from './views/components/map/MapContextProvider';
import { MapEditorContextProvider } from './views/mapEditor/contexts/mapEditorContextProvider';

import classNames from 'classnames';
import { useContext } from 'react';
import { MonsterActionsMap, NpcActionsMap } from './actions';
import styles from './app.module.scss';
import { SpriteGroupContextProvider } from './dialogs/spriteGroupDialog/SpriteGroupContext';
import { SpriteGroupDialog } from './dialogs/spriteGroupDialog/SpriteGroupDialog';
import { ItemsContextProvider } from './views/items/ItemsContextProvider';
import { MonsterPanel } from './views/monsterPanel';
import { CharacterContextProvider } from './views/monsterPanel/CharacterContextProvider';
import { QuestsContextProvider } from './views/quests/QuestsContextProvider';

const darkTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
    },
});

const MonsterView = () => {
    const packageContext = useContext(PackageContext);
    const characters = packageContext.backendStore.monsters?.data ?? {};
    const characterTemplates = packageContext?.backendStore?.monsterTemplates?.data ?? {};

    return <CharacterContextProvider
        characterTemplateActions={MonsterActionsMap}
        characterTemplates={characterTemplates}
        characters={characters}
    >
        <AllDialogs />
        <MonsterPanel />
    </CharacterContextProvider>
}

const NpcView = () => {
    const packageContext = useContext(PackageContext);
    const characters = packageContext.backendStore.npcs?.data ?? {};
    const characterTemplates = packageContext?.backendStore?.npcTemplates?.data ?? {};

    return <CharacterContextProvider
        characterTemplateActions={NpcActionsMap}
        characterTemplates={characterTemplates}
        characters={characters}
    >
        <AllDialogs />
        <NpcPanel />
    </CharacterContextProvider>
}

const router = createBrowserRouter([
    {
        path: '/',
        element: <SpriteGroupContextProvider>
            <SpriteGroupDialog />
            <AllDialogs />
            <MapEditor />
        </SpriteGroupContextProvider>,
    },
    {
        path: '/npc',
        element: <NpcView />,
    },
    {
        path: '/monsters',
        element: <MonsterView />,
    },
    {
        path: '/items',
        element: <>
            <AllDialogs />
            <Items />
        </>,
    },
    {
        path: '/quests',
        element: <>
            <AllDialogs />
            <Quests />
        </>,
    },
]);

export function App() {
    return (
        <KeyBoardContextProvider>
            <PackageContextProvider>
                <DialogProvider>
                    <SocketCommunicator>
                        <MapEditorContextProvider>
                            <MapContextProvider>
                                <ItemsContextProvider>
                                    <QuestsContextProvider>
                                        <ThemeProvider theme={darkTheme}>
                                            <CssBaseline />

                                            <AppBar position="static">
                                                <Toolbar>
                                                    <Typography mr={6} component="h1" variant="h5" color="inherit" noWrap>
                                                        Creator
                                                    </Typography>

                                                    <Typography component="h3" variant="h6" color="inherit" noWrap>
                                                        <a
                                                            className={classNames({ [styles['link']]: true, [styles['active']]: window.location.pathname === '/' })}
                                                            href={'/'}
                                                        >
                                                            Map
                                                        </a>
                                                    </Typography>
                                                    <Typography component="h3" variant="h6" color="inherit" noWrap>
                                                        <a
                                                            className={classNames({ [styles['link']]: true, [styles['active']]: window.location.pathname === '/npc' })}
                                                            href={'/npc'}
                                                        >
                                                            Npcs
                                                        </a>
                                                    </Typography>
                                                    <Typography component="h3" variant="h6" color="inherit" noWrap>
                                                        <a
                                                            className={classNames({ [styles['link']]: true, [styles['active']]: window.location.pathname === '/monsters' })}
                                                            href={'/monsters'}
                                                        >
                                                            Monsters
                                                        </a>
                                                    </Typography>
                                                    <Typography component="h3" variant="h6" color="inherit" noWrap>
                                                        <a
                                                            className={classNames({ [styles['link']]: true, [styles['active']]: window.location.pathname === '/items' })}
                                                            href={'/items'}
                                                        >
                                                            Items
                                                        </a>
                                                    </Typography>
                                                    <Typography component="h3" variant="h6" color="inherit" noWrap>
                                                        <a
                                                            className={classNames({ [styles['link']]: true, [styles['active']]: window.location.pathname === '/quests' })}
                                                            href={'/quests'}
                                                        >
                                                            Quests
                                                        </a>
                                                    </Typography>
                                                </Toolbar>
                                            </AppBar>

                                            <RouterProvider router={router} />
                                        </ThemeProvider>
                                    </QuestsContextProvider>
                                </ItemsContextProvider>
                            </MapContextProvider>
                        </MapEditorContextProvider>
                    </SocketCommunicator>
                </DialogProvider>
            </PackageContextProvider>
        </KeyBoardContextProvider>
    );
}

export default App;
