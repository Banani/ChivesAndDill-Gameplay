import type { FunctionComponent } from 'react';
import React from 'react';
import styles from './ModalHeader.module.scss';
import { Button } from '../../../components/button/Button';

interface ActiveNpc {
   avatar: string;
   name: string;
}

export const ModalHeader = (activeNpc, closeButtonHandler) => (
   <div className={styles.ModalHeader}>
      <img className={styles.Avatar} src={activeNpc.avatar} alt={''} />
      <div className={styles.Name}>{activeNpc.name}</div>
      <Button className={styles.closeButton} onClick={closeButtonHandler}>
         X
      </Button>
   </div>
);