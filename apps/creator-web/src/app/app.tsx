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
                                    <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                                       Creator
                                    </Typography>

                                    <Typography component="h3" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                                       <a href={'/'}>Map</a>
                                    </Typography>
                                    <Typography component="h3" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                                       <a href={'/npc'}>NPC</a>
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
