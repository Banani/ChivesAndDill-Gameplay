// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { SocketCommunicator, PackageContext } from './contexts';
import { PackageContextProvider } from './contexts/packageContext';
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
