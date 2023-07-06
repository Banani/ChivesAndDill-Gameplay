import React from 'react';
import styles from './DetailsModal.module.scss';

export const DetailsModal = ({ children, setStatesModal }) => {
  console.log();

  return (
    <div className={styles.DetailsModal} onMouseLeave={() => setStatesModal(false)}>
      {children}
    </div>
  )
}