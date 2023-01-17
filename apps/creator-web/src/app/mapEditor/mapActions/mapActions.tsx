import CropSquareIcon from '@mui/icons-material/CropSquare';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Grid3x3Icon from '@mui/icons-material/Grid3x3';
import Grid4x4Icon from '@mui/icons-material/Grid4x4';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import PanToolIcon from '@mui/icons-material/PanTool';

import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { useContext, useEffect, useState } from 'react';
import { KeyBoardContext } from '../../contexts';
import { BrushSize, MapActionsList, MapEditorContext } from '../contexts/mapEditorContextProvider';

import styles from './mapActions.module.scss';

export const MapActions = () => {
   const { currentMapAction, setCurrentMapAction, brushSize, setBrushSize } = useContext(MapEditorContext);
   const keyBoardContext = useContext(KeyBoardContext);

   const [prevState, setPrevState] = useState(MapActionsList.Edit);
   const [isTranslationKeyDown, setTranslationKeyDown] = useState(false);

   useEffect(() => {
      keyBoardContext.addKeyHandler({
         id: 'translation',
         matchRegex: 't',
         keydown: () => {
            if (!isTranslationKeyDown) {
               setTranslationKeyDown(true);
               setPrevState(currentMapAction);
               setCurrentMapAction(MapActionsList.Translate);
            }
         },
         keyup: () => {
            setTranslationKeyDown(false);
            setCurrentMapAction(prevState);
         },
      });

      keyBoardContext.addKeyHandler({
         id: 'delete',
         matchRegex: 'd',
         keydown: () => {
            setCurrentMapAction(MapActionsList.Delete);
         },
      });

      keyBoardContext.addKeyHandler({
         id: 'edit',
         matchRegex: 'e',
         keydown: () => {
            setCurrentMapAction(MapActionsList.Edit);
         },
      });

      keyBoardContext.addKeyHandler({
         id: 'brushSmall',
         matchRegex: 'z',
         keydown: () => {
            setBrushSize(BrushSize.Small);
         },
      });
      keyBoardContext.addKeyHandler({
         id: 'brushMedium',
         matchRegex: 'x',
         keydown: () => {
            setBrushSize(BrushSize.Medium);
         },
      });
      keyBoardContext.addKeyHandler({
         id: 'brushBig',
         matchRegex: 'c',
         keydown: () => {
            setBrushSize(BrushSize.Big);
         },
      });

      return () => {
         keyBoardContext.removeKeyHandler('translation');
         keyBoardContext.removeKeyHandler('delete');
         keyBoardContext.removeKeyHandler('edit');

         keyBoardContext.removeKeyHandler('brushSmall');
         keyBoardContext.removeKeyHandler('brushMedium');
         keyBoardContext.removeKeyHandler('brushBig');
      };
   }, [currentMapAction, prevState, isTranslationKeyDown]);

   return (
      <div className={styles['mapActionList']}>
         <Tooltip title="Edit (E)" placement="right">
            <Button
               onClick={() => setCurrentMapAction(MapActionsList.Edit)}
               variant={currentMapAction === MapActionsList.Edit ? 'contained' : 'outlined'}
               className={styles['button']}
            >
               <ModeEditIcon />
            </Button>
         </Tooltip>
         <Tooltip title="Translation (T)" placement="right">
            <Button
               onClick={() => setCurrentMapAction(MapActionsList.Translate)}
               variant={currentMapAction === MapActionsList.Translate ? 'contained' : 'outlined'}
               className={styles['button']}
            >
               <PanToolIcon />
            </Button>
         </Tooltip>
         <Tooltip title="Delete (D)" placement="right">
            <Button
               onClick={() => setCurrentMapAction(MapActionsList.Delete)}
               variant={currentMapAction === MapActionsList.Delete ? 'contained' : 'outlined'}
               className={styles['button']}
            >
               <DeleteForeverIcon />
            </Button>
         </Tooltip>

         <hr />

         <Tooltip title="Small brush (Z)" placement="right">
            <Button
               onClick={() => setBrushSize(BrushSize.Small)}
               variant={brushSize === BrushSize.Small ? 'contained' : 'outlined'}
               className={styles['button']}
            >
               <CropSquareIcon />
            </Button>
         </Tooltip>
         <Tooltip title="Medium brush (X)" placement="right">
            <Button
               onClick={() => setBrushSize(BrushSize.Medium)}
               variant={brushSize === BrushSize.Medium ? 'contained' : 'outlined'}
               className={styles['button']}
            >
               <Grid3x3Icon />
            </Button>
         </Tooltip>
         <Tooltip title="Big brush (C)" placement="right">
            <Button onClick={() => setBrushSize(BrushSize.Big)} variant={brushSize === BrushSize.Big ? 'contained' : 'outlined'} className={styles['button']}>
               <Grid4x4Icon />
            </Button>
         </Tooltip>
      </div>
   );
};
