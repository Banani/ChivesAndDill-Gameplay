// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { SocketModule, SocketAwareState } from 'libs/socket-store/src';
import { Provider } from 'react-redux';
import { createStore } from 'redux-dynamic-modules-core';
import { IModuleStore } from 'redux-dynamic-modules';
import SocketCommunicator from './socketCommunicator';
import { PackageContextProvider } from './PackageContext';
import { MapEditor } from './mapEditor/mapEditor';

const darkTheme = createTheme({
   palette: {
      mode: 'light',
      primary: {
         main: '#1976d2',
      },
   },
});

const store: IModuleStore<SocketAwareState> = createStore(
   {
      initialState: {},
      extensions: [],
   },
   SocketModule
);

export function App() {
   return (
      <Provider store={store}>
         <PackageContextProvider>
            <SocketCommunicator>
               <ThemeProvider theme={darkTheme}>
                  <CssBaseline />
                  <MapEditor />
               </ThemeProvider>
            </SocketCommunicator>
         </PackageContextProvider>
      </Provider>
   );
}

export default App;
