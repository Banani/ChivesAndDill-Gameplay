import { KeyBoardContext } from 'apps/chives-and-dill/src/contexts/KeyBoardContext';
import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import styles from './InputDialog.module.scss';

interface InputDialogProps {
   message: string;
   isVisible: boolean;
   mainAction: (value: string) => void;
   cancel: () => void;
}

export const InputDialog: FunctionComponent<InputDialogProps> = ({ isVisible, mainAction, cancel, message }) => {
   const [inputValue, setInputValue] = useState('');
   const keyBoardContext = useContext(KeyBoardContext);

   useEffect(() => {
      if (!isVisible) {
         setInputValue('');
      }
   }, [isVisible]);

   useEffect(() => {
      if (isVisible) {
         keyBoardContext.addKeyHandler({
            id: 'InputDialog',
            matchRegex: 'Escape',
            keydown: cancel,
         });
      } else {
         keyBoardContext.removeKeyHandler('InputDialog');
         keyBoardContext.removeKeyHandler('InputDialogBlockAll');
      }

      return () => {
         keyBoardContext.removeKeyHandler('InputDialog');
         keyBoardContext.removeKeyHandler('InputDialogBlockAll');
      };
   }, [isVisible]);

   return (
      isVisible && (
         <form onSubmit={() => mainAction(inputValue)}>
            <div className={styles.dialog}>
               <div className={styles.section}>
                  <label>{message}</label>
                  <input
                     className={styles.input}
                     onFocus={() => keyBoardContext.addKeyHandler({ id: 'InputDialogBlockAll', matchRegex: '.*' })}
                     onBlur={() => keyBoardContext.removeKeyHandler('InputDialogBlockAll')}
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
