// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CssBaseline, Toolbar } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { KeyBoardContextProvider, PackageContextProvider, SocketCommunicator } from './contexts';
import { DialogProvider } from './contexts/dialogContext';
import { AllDialogs } from './dialogs';
import { MapEditor, NpcContextProvider, NpcPanel } from './views';
import { MapContextProvider } from './views/components/map/MapContextProvider';
import { MapEditorContextProvider } from './views/mapEditor/contexts/mapEditorContextProvider';

import classNames from 'classnames';
import styles from './app.module.scss';

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
      element: <MapEditor />,
   },
   {
      path: '/npc',
      element: <NpcPanel />,
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
                        <NpcContextProvider>
                           <ThemeProvider theme={darkTheme}>
                              <CssBaseline />
                              <AllDialogs />

                              <AppBar position="static">
                                 <Toolbar>
                                    <Typography mr={6} component="h1" variant="h5" color="inherit" noWrap>
                                       Creator
                                    </Typography>

                                    <Typography component="h3" variant="h6" color="inherit" noWrap>
                                       <a className={classNames({ [styles['link']]: true, [styles['active']]: window.location.pathname === '/' })} href={'/'}>
                                          Map
                                       </a>
                                    </Typography>
                                    <Typography component="h3" variant="h6" color="inherit" noWrap>
                                       <a
                                          className={classNames({ [styles['link']]: true, [styles['active']]: window.location.pathname === '/npc' })}
                                          href={'/npc'}
                                       >
                                          Npc
                                       </a>
                                    </Typography>
                                 </Toolbar>
                              </AppBar>

                              <RouterProvider router={router} />
                           </ThemeProvider>
                        </NpcContextProvider>
                     </MapContextProvider>
                  </MapEditorContextProvider>
               </SocketCommunicator>
            </DialogProvider>
         </PackageContextProvider>
      </KeyBoardContextProvider>
   );
}

export default App;
