import AddIcon from '@mui/icons-material/Add';
import PanToolIcon from '@mui/icons-material/PanTool';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { useContext, useEffect, useState } from 'react';
import { KeyBoardContext } from '../../../contexts';
import { NpcActionsList, NpcContext } from '../NpcContextProvider';

import styles from './npcActions.module.scss';

export const NpcActions = () => {
   const { currentNpcAction, setCurrentNpcAction } = useContext(NpcContext);
   const keyBoardContext = useContext(KeyBoardContext);

   const [prevState, setPrevState] = useState(NpcActionsList.Adding);
   const [isTranslationKeyDown, setTranslationKeyDown] = useState(false);

   useEffect(() => {
      keyBoardContext.addKeyHandler({
         id: 'translation',
         matchRegex: 't',
         keydown: () => {
            if (!isTranslationKeyDown) {
               setTranslationKeyDown(true);
               setPrevState(currentNpcAction);
               setCurrentNpcAction(NpcActionsList.Translate);
            }
         },
         keyup: () => {
            setTranslationKeyDown(false);
            setCurrentNpcAction(prevState);
         },
      });

      keyBoardContext.addKeyHandler({
         id: 'adding',
         matchRegex: 'a',
         keydown: () => {
            setCurrentNpcAction(NpcActionsList.Adding);
         },
      });

      keyBoardContext.addKeyHandler({
         id: 'delete',
         matchRegex: 'd',
         keydown: () => {
            setCurrentNpcAction(NpcActionsList.Delete);
         },
      });

      return () => {
         keyBoardContext.removeKeyHandler('translation');
         keyBoardContext.removeKeyHandler('delete');
         keyBoardContext.removeKeyHandler('adding');
      };
   }, [currentNpcAction, prevState, isTranslationKeyDown]);

   return (
      <div className={styles['mapActionList']}>
         {
            <Tooltip title="Adding (A)" placement="right">
               <Button
                  onClick={() => setCurrentNpcAction(NpcActionsList.Adding)}
                  variant={currentNpcAction === NpcActionsList.Adding ? 'contained' : 'outlined'}
                  className={styles['button']}
               >
                  <AddIcon />
               </Button>
            </Tooltip>
         }
         <Tooltip title="Translation (T)" placement="right">
            <Button
               onClick={() => setCurrentNpcAction(NpcActionsList.Translate)}
               variant={currentNpcAction === NpcActionsList.Translate ? 'contained' : 'outlined'}
               className={styles['button']}
            >
               <PanToolIcon />
            </Button>
         </Tooltip>
         {
            <Tooltip title="Delete (D)" placement="right">
               <Button
                  onClick={() => setCurrentNpcAction(NpcActionsList.Delete)}
                  variant={currentNpcAction === NpcActionsList.Delete ? 'contained' : 'outlined'}
                  className={styles['button']}
               >
                  <DeleteForeverIcon />
               </Button>
            </Tooltip>
         }
      </div>
   );
};
