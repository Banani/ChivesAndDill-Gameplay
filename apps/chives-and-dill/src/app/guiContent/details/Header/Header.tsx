import React, { useState } from 'react';
import styles from './Header.module.scss';
import SkullImg from '../../../../assets/spritesheets/details/DetailsSkull.png';
import ConfigImg from '../../../../assets/spritesheets/details/DetailsConfig.png';
import NoteImg from '../../../../assets/spritesheets/details/DetailsNote.png';
import SwordImg from '../../../../assets/spritesheets/details/DetailsSword.png';
import ChatlImg from '../../../../assets/spritesheets/details/DetailsChat.png';
import ResetImg from '../../../../assets/spritesheets/details/DetailsReset.png';
import { StatesModal } from '../states/StatesModal';

export const Header = ({ activeState, changeActiveState }) => {
  console.log();

  return (
    <div className={styles.Header}>
      <div>{activeState} [5]</div>
      <div className={styles.DetailsIcons}>
        <img className={styles.Icon} src={SkullImg} alt={'Skull img'} />
        <img className={styles.Icon} src={ConfigImg} alt={'Config img'} />
        <img className={styles.Icon} src={NoteImg} alt={'Note img'} />
        <img
          className={styles.Icon}
          src={SwordImg}
          alt={'Sword img'}
        />
        <img className={styles.Icon} src={ChatlImg} alt={'Chat img'} />
        <img className={styles.Icon} src={ResetImg} alt={'Reset img'} />
      </div>
      {<StatesModal changeActiveState={changeActiveState} />}
    </div>
  )
}