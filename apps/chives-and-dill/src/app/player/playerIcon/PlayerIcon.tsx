import React from 'react';
import styles from "./PlayerIcon.module.scss";

export const PlayerIcon = ({ player }) => {

  const { name, maxHp, currentHp, currentSpellPower, maxSpellPower } = player;

  return (
    <div className={styles.playerIconContainer}>
      <div className={styles.playerAvatar}></div>
      <div className={styles.playerLvl}>69</div>
      <div className={styles.barsContainer}>
        <div className={styles.nameBar}>{name}</div>
        <div className={styles.bar}>
          <div className={styles.barText}>{currentHp >= 0 ? currentHp + "/" + maxHp : 0}</div>
          <div className={styles.hpColor} style={{ width: currentHp >= 0 ? (currentHp / maxHp) * 100 + "%" : "0" }}></div>
        </div>
        <div className={styles.bar}>
          <div className={styles.barText}>{currentSpellPower >= 0 ? currentSpellPower + "/" + maxSpellPower : 0}</div>
          <div className={styles.manaColor} style={{ width: currentSpellPower >= 0 ? (currentSpellPower / maxSpellPower) * 100 + "%" : "0" }}></div>
        </div>
      </div>
    </div>
  )
}