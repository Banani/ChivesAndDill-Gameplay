import React from 'react';
import { RectangleButton } from '../rectangleButton/RectangleButton';
import styles from './QueryModal.module.scss';

export const QueryModal = ({ accept, decline, text }) => {

  return (
    <div className={styles.QueryModal}>
      <div className={styles.QueryModalText}>{text}</div>
      <div className={styles.QueryModalButtons}>
        <RectangleButton onClick={() => accept()}>Accept</RectangleButton>
        <RectangleButton onClick={() => decline()}>Decline</RectangleButton>
      </div>
    </div>
  )
}