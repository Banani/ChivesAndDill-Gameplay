import { GameControllerContext } from 'apps/chives-and-dill/src/contexts/GameController';
import React, { useContext } from 'react';
import { TimeEffectsBar } from '../timeEffectsBar/TimeEffectsBar';
import styles from './ActivePlayerTimeEffects.module.scss';

export const ActivePlayerTimeEffects = () => {
    const { activeCharacterId } = useContext(GameControllerContext);

    return <div className={styles.activePlayerTimeEffects}>
        <TimeEffectsBar playerId={activeCharacterId} />
    </div>
}
