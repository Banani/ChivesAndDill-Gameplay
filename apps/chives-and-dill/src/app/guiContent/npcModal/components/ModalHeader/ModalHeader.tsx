import React from 'react';
import styles from './ModalHeader.module.scss';
import { Button } from '../../../components/button/Button';

export const ModalHeader = ({ activeNpc, closeNpcModal }) => (
   <div className={styles.ModalHeader}>
      <img className={styles.Avatar} src={activeNpc.avatar} alt={''} />
      <div className={styles.Name}>{activeNpc.name}</div>
      <Button className={styles.closeButton} onClick={() => closeNpcModal()}>
         X
      </Button>
   </div>
);