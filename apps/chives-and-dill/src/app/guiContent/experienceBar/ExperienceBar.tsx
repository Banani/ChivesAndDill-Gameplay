import React from 'react';
import { selectActiveCharacterId, getExperience } from '../../../stores';
import { useSelector } from 'react-redux';
import styles from './ExperienceBar.module.scss';

export const ExperienceBar = () => {

  const activePlayerId = useSelector(selectActiveCharacterId);
  const experience = useSelector(getExperience);

  const { experienceAmount, toNextLevel } = experience[activePlayerId];

  const levelProgress = (experienceAmount / toNextLevel) * 100;

  return (
    <div className={styles.ExperienceBar}>
      <div className={styles.ProgressBar} style={{ width: levelProgress + '%' }}>
      </div>
      <div className={styles.ProgressBarDetails}>{experienceAmount + ' / ' + toNextLevel + ' (' + levelProgress.toFixed(2) + ' %) exp'}</div>
    </div>
  )
};
