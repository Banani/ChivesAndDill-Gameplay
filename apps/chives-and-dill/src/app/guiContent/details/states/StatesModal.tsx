import React from 'react';
import styles from './StatesModal.module.scss';
import DamageIcon from '../../../../assets/spritesheets/details/Damage.png';
import HealIcon from '../../../../assets/spritesheets/details/Heal.png';
import { DetailsModal } from '../modal/DetailsModal';

enum States {
  Damage = "Damage",
  Heal = "Heal",
  DamageTaken = "Damage Taken"
}

export const StatesModal = ({ changeActiveState, setStatesModal }) => {
  console.log();

  return (
    <DetailsModal setStatesModal={setStatesModal}>
      <div className={styles.StatesModal}>
        <div className={styles.Item} onClick={() => changeActiveState(States.Damage)}>
          <img src={DamageIcon} alt="damage icon" className={styles.ItemImg} />
          <div>Damage</div>
        </div>
        <div className={styles.Item} onClick={() => changeActiveState(States.Heal)}>
          <img src={HealIcon} alt="heal icon" className={styles.ItemImg} />
          <div>Heal</div>
        </div>
        <div className={styles.Item} onClick={() => changeActiveState(States.DamageTaken)}>
          <img src={HealIcon} alt="damage taken icon" className={styles.ItemImg} />
          <div>Damage taken</div>
        </div>
      </div>
    </DetailsModal>
  )
}