import { IconButton, ImageList, ImageListItem, ImageListItemBar, Paper, Toolbar } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import { MapEditorContextProvider } from './contexts/mapEditorContextProvider';

import { Map } from './map';

import styles from './mapEditor.module.scss';
import { SpritePanel } from './spritePanel/spritePanel';

export const MapEditor = () => {
   return (
      <MapEditorContextProvider>
         <AppBar className={styles['app-bar']} position="static">
            <Toolbar>
               <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                  Creator
               </Typography>
            </Toolbar>
         </AppBar>
         <div className={styles['app-view']}>
            <SpritePanel />
            <Paper className={styles['map-editor']}>
               <Map />
            </Paper>
         </div>
      </MapEditorContextProvider>
   );
};
