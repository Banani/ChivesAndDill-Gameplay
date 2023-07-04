import React from 'react';
import styles from './DetailsModal.module.scss';

export const DetailsModal = ({ children }) => {
  console.log();

  return (
    <div className={styles.DetailsModal}>
      {children}
    </div>
  )
}