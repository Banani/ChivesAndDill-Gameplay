// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { KeyBoardContextProvider, PackageContextProvider, SocketCommunicator } from './contexts';
import { DialogProvider } from './contexts/dialogContext';
import { AllDialogs } from './dialogs';
import { MapEditorContextProvider } from './mapEditor/contexts/mapEditorContextProvider';
import { MapEditor } from './mapEditor/mapEditor';

const darkTheme = createTheme({
   palette: {
      mode: 'light',
      primary: {
         main: '#1976d2',
      },
   },
});

export function App() {
   return (
      <KeyBoardContextProvider>
         <PackageContextProvider>
            <DialogProvider>
               <SocketCommunicator>
                  <MapEditorContextProvider>
                     <ThemeProvider theme={darkTheme}>
                        <CssBaseline />
                        <AllDialogs />
                        <MapEditor />
                     </ThemeProvider>
                  </MapEditorContextProvider>
               </SocketCommunicator>
            </DialogProvider>
         </PackageContextProvider>
      </KeyBoardContextProvider>
   );
}

export default App;
