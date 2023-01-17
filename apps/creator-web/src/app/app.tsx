// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { KeyBoardContextProvider, PackageContextProvider, SocketCommunicator } from './contexts';
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
            <SocketCommunicator>
               <ThemeProvider theme={darkTheme}>
                  <CssBaseline />
                  <MapEditor />
               </ThemeProvider>
            </SocketCommunicator>
         </PackageContextProvider>
      </KeyBoardContextProvider>
   );
}

export default App;
