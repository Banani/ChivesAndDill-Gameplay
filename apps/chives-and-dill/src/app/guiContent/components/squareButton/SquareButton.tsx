import type { FunctionComponent } from 'react';
import React from 'react';
import styles from './SquareButton.module.scss';

interface SquareButtonProps {
   onClick?: () => void;
   disabled?: boolean;
   className?: string;
}

export const SquareButton: FunctionComponent<SquareButtonProps> = ({ className, onClick, children, disabled = false }) => (
   <button className={styles.Button + ' ' + className} onClick={onClick} disabled={disabled}>
      {children}
   </button>
);