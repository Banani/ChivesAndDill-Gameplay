import React from 'react';
import styles from './ModalHeader.module.scss';
import { RectangleButton } from '../../../components/rectangleButton/RectangleButton';

export const ModalHeader = ({ activeNpc, closeNpcModal }) => (
   <div className={styles.ModalHeader}>
      <img className={styles.Avatar} src={activeNpc.avatar} alt={''} />
      <div className={styles.Name}>{activeNpc.name}</div>
      <RectangleButton className={styles.closeButton} onClick={() => closeNpcModal()}>
         X
      </RectangleButton>
   </div>
);