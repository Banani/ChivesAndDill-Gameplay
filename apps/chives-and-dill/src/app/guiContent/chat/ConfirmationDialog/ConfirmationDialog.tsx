import { KeyBoardContext } from 'apps/chives-and-dill/src/contexts/KeyBoardContext';
import React, { FunctionComponent, useContext, useEffect } from 'react';
import { Button } from '../../components/button/Button';
import styles from './ConfirmationDialog.module.scss';

interface ConfirmationDialogProps {
   message: string;
   isVisible: boolean;
   accept: () => void;
   cancel: () => void;
}

export const ConfirmationDialog: FunctionComponent<ConfirmationDialogProps> = ({ isVisible, accept, cancel, message }) => {
   const keyBoardContext = useContext(KeyBoardContext);

   useEffect(() => {
      if (isVisible) {
         keyBoardContext.addKeyHandler({
            id: 'ConfirmationDialogEscape',
            matchRegex: 'Escape',
            keydown: cancel,
         });

         keyBoardContext.addKeyHandler({
            id: 'ConfirmationDialogEnter',
            matchRegex: 'Enter',
            keydown: accept,
         });
      } else {
         keyBoardContext.removeKeyHandler('ConfirmationDialogEscape');
         keyBoardContext.removeKeyHandler('ConfirmationDialogEnter');
      }

      return () => {
         keyBoardContext.removeKeyHandler('ConfirmationDialogEscape');
         keyBoardContext.removeKeyHandler('ConfirmationDialogEnter');
      };
   }, [isVisible]);

   return (
      isVisible && (
         <div className={styles.dialog}>
            <div className={styles.section}>
               <div className={styles.message}>{message}</div>
            </div>

            <div className={styles.actionBar}>
               <Button className={styles.actionButton} onClick={accept}>
                  Okay
               </Button>
               <Button className={styles.actionButton} onClick={cancel}>
                  Cancel
               </Button>
            </div>
         </div>
      )
   );
};
