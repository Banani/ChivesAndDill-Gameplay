// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CssBaseline, Toolbar } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { KeyBoardContextProvider, PackageContext, PackageContextProvider, SocketCommunicator } from './contexts';
import { DialogProvider } from './contexts/dialogContext';
import { AllDialogs } from './dialogs';
import { Items, MapEditor, NpcPanel, Quests, Spells } from './views';
import { MapContextProvider } from './views/components/map/MapContextProvider';
import { MapEditorContextProvider } from './views/mapEditor/contexts/mapEditorContextProvider';

import classNames from 'classnames';
import { useContext } from 'react';
import { MonsterActionsMap, NpcActionsMap } from './actions';
import styles from './app.module.scss';
import { AnimatedSpritesDialog } from './dialogs/animatedSpritesDialog';
import { CharacterClassesDialog } from './dialogs/characterClassesDialog';
import { EditAnimatedSpritesDialog } from './dialogs/editAnimatedSpritesDialog';
import { EditSpriteGroupDialog } from './dialogs/editSpriteGroupDialog';
import { SpellDialog } from './dialogs/spellDialog';
import { SpriteGroupContextProvider } from './dialogs/spriteGroupDialog/SpriteGroupContext';
import { SpriteGroupDialog } from './dialogs/spriteGroupDialog/SpriteGroupDialog';
import { CharacterClasses } from './views/characterClasses';
import { CharacterClassesContextProvider } from './views/characterClasses/CharacterClassesContextProvider';
import { ItemsContextProvider } from './views/items/ItemsContextProvider';
import { MonsterPanel } from './views/monsterPanel';
import { CharacterContextProvider } from './views/monsterPanel/CharacterContextProvider';
import { QuestsContextProvider } from './views/quests/QuestsContextProvider';
import { SpellsContextProvider } from './views/spells/SpellsContextProvider';

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
            <AnimatedSpritesDialog />
            <EditAnimatedSpritesDialog />
            <SpriteGroupDialog />
            <EditSpriteGroupDialog />
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
    {
        path: '/spells',
        element: <SpellsContextProvider>
            <SpellDialog />
            <Spells />
        </SpellsContextProvider>,
    },
    {
        path: '/classes',
        element: <CharacterClassesContextProvider>
            <CharacterClassesDialog />
            <CharacterClasses />
        </CharacterClassesContextProvider>,
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
                                                    <Typography component="h3" variant="h6" color="inherit" noWrap>
                                                        <a
                                                            className={classNames({ [styles['link']]: true, [styles['active']]: window.location.pathname === '/spells' })}
                                                            href={'/spells'}
                                                        >
                                                            Spells
                                                        </a>
                                                    </Typography>
                                                    <Typography component="h3" variant="h6" color="inherit" noWrap>
                                                        <a
                                                            className={classNames({ [styles['link']]: true, [styles['active']]: window.location.pathname === '/classes' })}
                                                            href={'/classes'}
                                                        >
                                                            Classes
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
