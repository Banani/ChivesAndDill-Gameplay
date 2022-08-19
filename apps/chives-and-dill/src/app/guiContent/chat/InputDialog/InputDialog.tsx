import React, { FunctionComponent, useEffect, useState } from 'react';
import styles from './InputDialog.module.scss';

interface InputDialogProps {
   message: string;
   isVisible: boolean;
   mainAction: (value: string) => void;
   cancel: () => void;
}

export const InputDialog: FunctionComponent<InputDialogProps> = ({ isVisible, mainAction, cancel, message }) => {
   const [inputValue, setInputValue] = useState('');

   useEffect(() => {
      if (!isVisible) {
         setInputValue('');
      }
   }, [isVisible]);

   return (
      isVisible && (
         <form onSubmit={() => mainAction(inputValue)}>
            <div className={styles.dialog}>
               <div className={styles.section}>
                  <label>{message}</label>
                  <input
                     className={styles.input}
                     value={inputValue}
                     maxLength={20}
                     onChange={(e) => {
                        e.stopPropagation();
                        setInputValue(e.target.value);
                     }}
                  />
               </div>

               <div className={styles.actionBar}>
                  <button className={styles.actionButton}>Okay</button>
                  <button className={styles.actionButton} onClick={cancel}>
                     Cancel
                  </button>
               </div>
            </div>
         </form>
      )
   );
};
