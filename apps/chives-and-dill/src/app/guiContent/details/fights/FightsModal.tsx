import _ from 'lodash';
import React from 'react';
import { FightScope } from '../Details';
import { DetailsModal } from '../modal/DetailsModal';
import styles from './FightsModal.module.scss';

export const FightsModal = ({ setFightListModal, fightHistory, setActiveFight }) => {

    const calculateTime = (start, end) => {
        const fightLength = Math.round((end - start) / 1000);
        let seconds = fightLength % 60;
        const minutes = Math.floor(fightLength / 60);

        return Math.min(minutes, 59) + ':' + (seconds < 10 ? "0" + seconds : seconds);
    }

    return (
        <DetailsModal setModal={setFightListModal}>
            <div className={styles.DetailsModal}>
                {_.map(fightHistory, (fight, key) => {
                    return <div onClick={() => setActiveFight(key)}>#{key}  -  {calculateTime(fight.startFightTime, fight.endFightTime)}</div>
                })}
                <div onClick={() => setActiveFight(FightScope.Current)}>Current Segment</div>
            </div>
        </DetailsModal>
    )
}