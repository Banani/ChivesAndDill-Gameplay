import React, { useState } from 'react';
import ChatlImg from '../../../../assets/spritesheets/details/DetailsChat.png';
import ConfigImg from '../../../../assets/spritesheets/details/DetailsConfig.png';
import NoteImg from '../../../../assets/spritesheets/details/DetailsNote.png';
import ResetImg from '../../../../assets/spritesheets/details/DetailsReset.png';
import SkullImg from '../../../../assets/spritesheets/details/DetailsSkull.png';
import SwordImg from '../../../../assets/spritesheets/details/DetailsSword.png';
import { States } from '../Details';
import { FightsModal } from '../fights/FightsModal';
import { StatesModal } from '../states/StatesModal';
import styles from './Header.module.scss';

export const Header = ({ activeState, changeActiveState, playersAmount, fightHistory, setActiveFight }) => {

    const StateMapper = {
        [States.Damage]: 'Damage Done',
        [States.DamageTaken]: 'Damage Taken',
        [States.Heal]: 'Healing Done',
    }

    const [statesModal, setStatesModal] = useState(false);
    const [fightListModal, setFightListModal] = useState(false);

    return (
        <div className={styles.Header}>
            <div>{StateMapper[activeState]} [{playersAmount}]</div>
            <div className={styles.DetailsIcons}>
                <img className={styles.Icon} src={SkullImg} alt={'Skull img'} />
                <img className={styles.Icon} src={ConfigImg} alt={'Config img'} />
                <img
                    className={styles.Icon}
                    src={NoteImg} alt={'Note img'}
                    onMouseEnter={() => setFightListModal(true)} />
                <img
                    className={styles.Icon}
                    src={SwordImg}
                    alt={'Sword img'}
                    onMouseEnter={() => setStatesModal(true)}
                />
                <img className={styles.Icon} src={ChatlImg} alt={'Chat img'} />
                <img className={styles.Icon} src={ResetImg} alt={'Reset img'} />
            </div>
            {statesModal ? <StatesModal changeActiveState={changeActiveState} setStatesModal={setStatesModal} /> : null}
            {fightListModal ? <FightsModal fightHistory={fightHistory} setFightListModal={setFightListModal} setActiveFight={setActiveFight} /> : null}
        </div>
    )
}