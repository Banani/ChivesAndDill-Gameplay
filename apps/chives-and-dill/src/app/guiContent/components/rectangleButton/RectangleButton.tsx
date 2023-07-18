import type { FunctionComponent } from 'react';
import React from 'react';
import styles from './RectangleButton.module.scss';

interface RectangleButtonProps {
   onClick?: () => void;
   disabled?: boolean;
   className?: string;
}

export const RectangleButton: FunctionComponent<RectangleButtonProps> = ({ className, onClick, children, disabled = false }) => (
   <button className={styles.Button + ' ' + className} onClick={onClick} disabled={disabled}>
      {children}
   </button>
);
