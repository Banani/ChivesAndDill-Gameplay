import React, { FunctionComponent } from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
   onClick?: () => void;
   disabled?: boolean;
   className?: string;
}

export const Button: FunctionComponent<ButtonProps> = ({ className, onClick, children, disabled = false }) => {
   return (
      <button className={styles.Button + ' ' + className} onClick={onClick} disabled={disabled}>
         {children}
      </button>
   );
};
