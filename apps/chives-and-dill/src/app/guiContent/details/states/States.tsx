import React from 'react';
import styles from './States.module.scss';
import DamageIcon from '../../../../assets/spritesheets/details/Damage.png';
import HealIcon from '../../../../assets/spritesheets/details/Heal.png';
import { DetailsModal } from '../modal/DetailsModal';

export const States = ({ changeModalStatus }) => {
  console.log();

  return (
    <DetailsModal>
      <div className={styles.Item}>
        <img src={DamageIcon} alt="damage icon" className={styles.ItemImg} onClick={changeModalStatus()} />
        <div>Damage</div>
      </div>
      <div className={styles.Item}>
        <img src={HealIcon} alt="heal icon" className={styles.ItemImg} onClick={changeModalStatus()} />
        <div>Heal</div>
      </div>
    </DetailsModal>
  )
}