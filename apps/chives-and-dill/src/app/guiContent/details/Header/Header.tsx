import React, { useState } from 'react';
import styles from './Header.module.scss';
import SkullImg from '../../../../assets/spritesheets/details/DetailsSkull.png';
import ConfigImg from '../../../../assets/spritesheets/details/DetailsConfig.png';
import NoteImg from '../../../../assets/spritesheets/details/DetailsNote.png';
import SwordImg from '../../../../assets/spritesheets/details/DetailsSword.png';
import ChatlImg from '../../../../assets/spritesheets/details/DetailsChat.png';
import ResetImg from '../../../../assets/spritesheets/details/DetailsReset.png';
import { DetailsModal } from '../modal/DetailsModal';

export const Header = () => {
  console.log();

  const [modalStatus, changeModalStatus] = useState(true);

  return (
    <div className={styles.Header}>
      <div>Damage done</div>
      <div className={styles.DetailsIcons}>
        <img className={styles.Icon} src={SkullImg} alt={'Skull img'}></img>
        <img className={styles.Icon} src={ConfigImg} alt={'Config img'}></img>
        <img className={styles.Icon} src={NoteImg} alt={'Note img'}></img>
        <img className={styles.Icon} src={SwordImg} alt={'Sword img'}></img>
        <img className={styles.Icon} src={ChatlImg} alt={'Chat img'}></img>
        <img className={styles.Icon} src={ResetImg} alt={'Reset img'}></img>
      </div>
      {modalStatus ? <DetailsModal /> : null}
    </div>
  )
}