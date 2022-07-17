// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CssBaseline, IconButton, ImageList, ImageListItem, ImageListItemBar, Paper, Toolbar } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';

import styles from './app.module.scss';

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
      <>
         <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <AppBar className={styles['app-bar']} position="static">
               <Toolbar>
                  <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                     Creator
                  </Typography>
               </Toolbar>
            </AppBar>
            <div className={styles['app-view']}>
               <div className={styles['control-panel']}>
                  <ImageList cols={3}>
                     <ImageListItem>
                        <img src={`https://a.allegroimg.com/s1024/0c6dd0/f2e4c2034ec397baf5f831538dbd`} loading="lazy" onClick={() => console.log(122)} />
                        <ImageListItemBar
                           title={'Fire sword'}
                           actionIcon={
                              <IconButton sx={{ color: 'rgba(255, 255, 255, 0.54)' }}>
                                 <EditIcon />
                              </IconButton>
                           }
                        />
                     </ImageListItem>
                     <ImageListItem>
                        <img src={`https://a.allegroimg.com/s1024/0c6dd0/f2e4c2034ec397baf5f831538dbd`} loading="lazy" />
                        <ImageListItemBar
                           title={'Fire sword'}
                           actionIcon={
                              <IconButton sx={{ color: 'rgba(255, 255, 255, 0.54)' }}>
                                 <EditIcon />
                              </IconButton>
                           }
                        />
                     </ImageListItem>
                     <ImageListItem>
                        <img src={`https://a.allegroimg.com/s1024/0c6dd0/f2e4c2034ec397baf5f831538dbd`} loading="lazy" />
                        <ImageListItemBar
                           title={'Fire sword'}
                           actionIcon={
                              <IconButton sx={{ color: 'rgba(255, 255, 255, 0.54)' }}>
                                 <EditIcon />
                              </IconButton>
                           }
                        />
                     </ImageListItem>
                     <ImageListItem>
                        <img src={`https://a.allegroimg.com/s1024/0c6dd0/f2e4c2034ec397baf5f831538dbd`} loading="lazy" />
                        <ImageListItemBar
                           title={'Fire sword'}
                           actionIcon={
                              <IconButton sx={{ color: 'rgba(255, 255, 255, 0.54)' }}>
                                 <EditIcon />
                              </IconButton>
                           }
                        />
                     </ImageListItem>
                     <ImageListItem>
                        <img src={`https://a.allegroimg.com/s1024/0c6dd0/f2e4c2034ec397baf5f831538dbd`} loading="lazy" />
                        <ImageListItemBar
                           title={'Fire sword'}
                           actionIcon={
                              <IconButton sx={{ color: 'rgba(255, 255, 255, 0.54)' }}>
                                 <EditIcon />
                              </IconButton>
                           }
                        />
                     </ImageListItem>
                  </ImageList>
               </div>
               <Paper className={styles['map-editor']}>
                  asdassdaaaaaaaaadsad <br />
                  asdassdaaaaaaaaadsad <br />
                  asdassdaaaaaaaaadsad <br />
                  asdassdaaaaaaaaadsad <br />
                  asdassdaaaaaaaaadsad <br />
                  asdassdaaaaaaaaadsad <br />
               </Paper>
            </div>
         </ThemeProvider>
      </>
   );
}

export default App;
