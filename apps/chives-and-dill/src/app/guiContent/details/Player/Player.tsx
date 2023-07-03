import { GlobalStoreModule } from '@bananos/types';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import React from 'react';
import styles from './Player.module.scss';

export const Player = () => {
  const { activeCharacterId } = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER).data;

  return (
    <div className={styles.Player}>
      <div className={styles.ClassIcon}></div>
      <div className={styles.ColorBar}>
        <div className={styles.PlayerName}>1. Percylia</div>
        <div className={styles.PlayerData}>321.23M</div>
        <div className={styles.PlayerData}>150k</div>
      </div>
    </div>
  )
}