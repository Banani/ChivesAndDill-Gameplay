import { KeyBoardContext } from 'apps/chives-and-dill/src/contexts/KeyBoardContext';
import React, { FunctionComponent, useContext, useEffect } from 'react';
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
            handler: cancel,
         });

         keyBoardContext.addKeyHandler({
            id: 'ConfirmationDialogEnter',
            matchRegex: 'Enter',
            handler: accept,
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
               <div>{message}</div>
            </div>

            <div className={styles.actionBar}>
               <button className={styles.actionButton} onClick={accept}>
                  Okay
               </button>
               <button className={styles.actionButton} onClick={cancel}>
                  Cancel
               </button>
            </div>
         </div>
      )
   );
};
