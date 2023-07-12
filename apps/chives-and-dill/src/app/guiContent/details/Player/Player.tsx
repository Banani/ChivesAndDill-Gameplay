import { CharacterClass, GlobalStoreModule } from '@bananos/types';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import React from 'react';
import styles from './Player.module.scss';
import { DatailsStats } from '../Details';
import { now } from 'lodash';

interface PlayerProps {
  damageStat: DatailsStats,
  playerCharacter: any,
  index: number,
  characterClass: CharacterClass,
  fightTime: number,
}

export const Player = ({ fightTime, damageStat, playerCharacter, index, characterClass }: PlayerProps) => {

  const dpsPerSec = Math.ceil(damageStat.amount / fightTime);

  return (
    <div className={styles.Player}>
      <img src={characterClass?.iconImage} className={styles.ClassIcon}></img>
      <div className={styles.ColorBar}>
        <div className={styles.PlayerName}>{index}. {playerCharacter.name}</div>
        <div className={styles.PlayerData}>{damageStat.amount}</div>
        <div className={styles.PlayerData}>{dpsPerSec}</div>
      </div>
    </div>
  )
}