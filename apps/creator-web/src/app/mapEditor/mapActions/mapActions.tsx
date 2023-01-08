import CropSquareIcon from '@mui/icons-material/CropSquare';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Grid3x3Icon from '@mui/icons-material/Grid3x3';
import Grid4x4Icon from '@mui/icons-material/Grid4x4';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import PanToolIcon from '@mui/icons-material/PanTool';

import Button from '@mui/material/Button';
import { useContext } from 'react';
import { BrushSize, MapActionsList, MapEditorContext } from '../contexts/mapEditorContextProvider';

import styles from './mapActions.module.scss';

export const MapActions = () => {
   const { currentMapAction, setCurrentMapAction, brushSize, setBrushSize } = useContext(MapEditorContext);

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

         <hr />

         <Button onClick={() => setBrushSize(BrushSize.Small)} variant={brushSize === BrushSize.Small ? 'contained' : 'outlined'} className={styles['button']}>
            <CropSquareIcon />
         </Button>

         <Button
            onClick={() => setBrushSize(BrushSize.Medium)}
            variant={brushSize === BrushSize.Medium ? 'contained' : 'outlined'}
            className={styles['button']}
         >
            <Grid3x3Icon />
         </Button>

         <Button onClick={() => setBrushSize(BrushSize.Big)} variant={brushSize === BrushSize.Big ? 'contained' : 'outlined'} className={styles['button']}>
            <Grid4x4Icon />
         </Button>
      </div>
   );
};
