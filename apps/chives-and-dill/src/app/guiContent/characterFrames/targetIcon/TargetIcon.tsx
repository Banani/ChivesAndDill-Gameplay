import React, { useContext } from 'react';
import { TimeEffectsbar } from '../../timeEffectsBar/TimeEffectsBar';
import { CharacterFramesContext } from '../CharacterFrames';
import { PlayerIcon } from '../playerIcon/PlayerIcon';
import styles from "./TargetIcon.module.scss";

export const TargetIcon = () => {
    const { activeTargetId } = useContext(CharacterFramesContext);

    return (
        <div className={styles.TargetFrame}>
            {activeTargetId ? <PlayerIcon playerId={activeTargetId} /> : null}
            <div className={styles.activePlayerTimeEffects}>
                <TimeEffectsbar playerId={activeTargetId} />
            </div>
        </div>
    )
}