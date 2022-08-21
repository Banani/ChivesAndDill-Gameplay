import React, { FunctionComponent } from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
   onClick: () => void;
   disabled?: boolean;
}

export const Button: FunctionComponent<ButtonProps> = ({ onClick, children, disabled = false }) => {
   return (
      <button className={styles.Button} onClick={onClick} disabled={disabled}>
         {children}
      </button>
   );
};
