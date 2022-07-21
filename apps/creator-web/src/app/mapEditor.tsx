import { IconButton, ImageList, ImageListItem, ImageListItemBar, Paper, Toolbar } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';

import styles from './app.module.scss';
import { useContext } from 'react';
import { PackageContext } from './PackageContext';
import { map } from 'lodash';

export const MapEditor = () => {
   const packageContext = useContext(PackageContext);

   return (
      <>
         <AppBar className={styles['app-bar']} position="static">
            <Toolbar>
               <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                  Creator
               </Typography>
            </Toolbar>
         </AppBar>
         <div className={styles['app-view']}>
            <div className={styles['control-panel']}>
               <ImageList cols={2}>
                  {map(packageContext?.backendStore?.sprites?.data, (sprite) => (
                     <ImageListItem>
                        <img src={'./assets/' + sprite.spriteSheet} loading="lazy" onClick={() => console.log(122)} />
                        <ImageListItemBar
                           title={'-'}
                           actionIcon={
                              <IconButton sx={{ color: 'rgba(255, 255, 255, 0.54)' }}>
                                 <EditIcon />
                              </IconButton>
                           }
                        />
                     </ImageListItem>
                  ))}
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
      </>
   );
};
