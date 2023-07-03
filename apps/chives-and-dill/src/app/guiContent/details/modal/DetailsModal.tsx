import React from 'react';
import styles from './DetailsModal.module.scss';
import DamageIcon from '../../../../assets/spritesheets/details/Damage.png';
import HealIcon from '../../../../assets/spritesheets/details/Heal.png';

export const DetailsModal = () => {
  console.log();

  return (
    <div className={styles.DetailsModal}>
      <div className={styles.Item}>
        <img src={DamageIcon} alt="damageIcon" />
        <div>Damage</div>
      </div>
      <div className={styles.Item}>
        <img src={HealIcon} alt="damageIcon" />
        <div>Damage</div>
      </div>
    </div>
  )
}