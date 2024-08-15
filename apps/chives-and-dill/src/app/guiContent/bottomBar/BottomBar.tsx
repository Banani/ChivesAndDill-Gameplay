import React from 'react';
import styles from './BottomBar.module.scss';
import { ExperienceBar } from '../experienceBar/ExperienceBar';
import { SpellsBar } from '../spellsBar/SpellsBar';

export const BottomBar = () => {

  return (
    <div className={styles.BottomBar}>
      <SpellsBar />
      <ExperienceBar />
    </div>
  )
}
