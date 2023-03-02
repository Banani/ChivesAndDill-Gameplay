// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CssBaseline, Toolbar } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { KeyBoardContextProvider, PackageContextProvider, SocketCommunicator } from './contexts';
import { DialogProvider } from './contexts/dialogContext';
import { AllDialogs } from './dialogs';
import { Items, MapEditor, NpcContextProvider, NpcPanel, Quests } from './views';
import { MapContextProvider } from './views/components/map/MapContextProvider';
import { MapEditorContextProvider } from './views/mapEditor/contexts/mapEditorContextProvider';

import classNames from 'classnames';
import styles from './app.module.scss';
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

const router = createBrowserRouter([
    {
        path: '/',
        element: <>
            <AllDialogs />
            <MapEditor />
        </>,
    },
    {
        path: '/npc',
        element: <>
            <AllDialogs />
            <NpcPanel />
        </>,
    },
    {
        path: '/monsters',
        element: <CharacterContextProvider>
            <AllDialogs />
            <MonsterPanel />
        </CharacterContextProvider>,
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
                                    <NpcContextProvider>
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
                                    </NpcContextProvider>
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
