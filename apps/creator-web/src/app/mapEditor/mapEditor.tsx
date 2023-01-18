import { Paper, Toolbar } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';

import { MapActions } from './mapActions';

import styles from './mapEditor.module.scss';
import { NpcTemplatesPanel } from './npcTemplatesPanel/npcTemplatesPanel';

export const MapEditor = () => {
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
            {/* <SpritePanel /> */}
            <NpcTemplatesPanel />
            <MapActions />

            <Paper className={styles['map-editor']}>{/* <Map /> */}</Paper>
         </div>
      </>
   );
};
