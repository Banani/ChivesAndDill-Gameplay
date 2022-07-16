// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Toolbar } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import styles from './app.module.scss';

const darkTheme = createTheme({
   palette: {
      mode: 'dark',
      primary: {
         main: '#1976d2',
      },
   },
});

export function App() {
   return (
      <>
         <ThemeProvider theme={darkTheme}>
            <AppBar className={styles['app-bar']} position="absolute">
               <Toolbar>
                  <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                     Creator
                  </Typography>
               </Toolbar>
            </AppBar>
         </ThemeProvider>
      </>
   );
}

export default App;
