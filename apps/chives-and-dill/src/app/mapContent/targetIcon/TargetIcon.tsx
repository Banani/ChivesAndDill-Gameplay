import React from 'react';
import { PlayerIcon } from '../../player/playerIcon/PlayerIcon';
import { selectActiveTargetId } from '../../../stores';
import { useSelector } from "react-redux";
import styles from "./TargetIcon.module.scss";
import { TimeEffectsbar } from '../../player/timeEffectsBar/TimeEffectsBar';

export const TargetIcon = () => {

  const activeTargetId = useSelector(selectActiveTargetId);
  return (
    <>
      <div className={styles.targetIconContainer}>
        {activeTargetId ? <PlayerIcon playerId={activeTargetId} /> : null}
      </div>
      <div className={styles.activePlayerTimeEffects}>
        <TimeEffectsbar playerId={activeTargetId} />
      </div>
    </>
  )
}