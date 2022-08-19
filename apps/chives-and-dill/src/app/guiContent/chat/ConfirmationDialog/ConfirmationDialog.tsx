import React, { FunctionComponent } from 'react';
import styles from './ConfirmationDialog.module.scss';

interface ConfirmationDialogProps {
   message: string;
   isVisible: boolean;
   accept: () => void;
   cancel: () => void;
}

export const ConfirmationDialog: FunctionComponent<ConfirmationDialogProps> = ({ isVisible, accept, cancel, message }) => {
   return (
      isVisible && (
         <div className={styles.dialog}>
            <div className={styles.section}>
               <div>{message}</div>
            </div>

            <div className={styles.actionBar}>
               <button className={styles.actionButton}>Okay</button>
               <button className={styles.actionButton} onClick={cancel}>
                  Cancel
               </button>
            </div>
         </div>
      )
   );
};
