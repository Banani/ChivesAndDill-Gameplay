import type { FunctionComponent } from 'react';
import React from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
   onClick?: () => void;
   disabled?: boolean;
   className?: string;
}

export const Button: FunctionComponent<ButtonProps> = ({ className, onClick, children, disabled = false }) => (
   <button className={styles.Button + ' ' + className} onClick={onClick} disabled={disabled}>
      {children}
   </button>
);
