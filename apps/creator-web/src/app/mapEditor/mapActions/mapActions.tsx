import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import PanToolIcon from '@mui/icons-material/PanTool';
import Button from '@mui/material/Button';
import { useContext } from 'react';
import { MapActionsList, MapEditorContext } from '../contexts/mapEditorContextProvider';

import styles from './mapActions.module.scss';

export const MapActions = () => {
   const { currentMapAction, setCurrentMapAction } = useContext(MapEditorContext);

   return (
      <div className={styles['mapActionList']}>
         <Button
            onClick={() => setCurrentMapAction(MapActionsList.Edit)}
            variant={currentMapAction === MapActionsList.Edit ? 'contained' : 'outlined'}
            className={styles['button']}
         >
            <ModeEditIcon />
         </Button>
         <Button
            onClick={() => setCurrentMapAction(MapActionsList.Translate)}
            variant={currentMapAction === MapActionsList.Translate ? 'contained' : 'outlined'}
            className={styles['button']}
         >
            <PanToolIcon />
         </Button>
         <Button
            onClick={() => setCurrentMapAction(MapActionsList.Delete)}
            variant={currentMapAction === MapActionsList.Delete ? 'contained' : 'outlined'}
            className={styles['button']}
         >
            <DeleteForeverIcon />
         </Button>
      </div>
   );
};
