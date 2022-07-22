// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SocketCommunicator from './socketCommunicator';
import { PackageContextProvider } from './PackageContext';
import { MapEditor } from './mapEditorView/mapEditor';

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
      <PackageContextProvider>
         <SocketCommunicator>
            <ThemeProvider theme={darkTheme}>
               <CssBaseline />
               <MapEditor />
            </ThemeProvider>
         </SocketCommunicator>
      </PackageContextProvider>
   );
}

export default App;
