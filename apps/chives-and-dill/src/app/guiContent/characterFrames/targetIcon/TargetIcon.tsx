import React from 'react';
import { PlayerIcon } from '../playerIcon/PlayerIcon';
import { selectActiveTargetId } from '../../../../stores';
import { useSelector } from "react-redux";
import styles from "./TargetIcon.module.scss";
import { TimeEffectsbar } from '../../timeEffectsBar/TimeEffectsBar';

export const TargetIcon = () => {

  const activeTargetId = useSelector(selectActiveTargetId);
  return (
    <div className={styles.TargetFrame}>
      {activeTargetId ? <PlayerIcon playerId={activeTargetId} /> : null}
      <div className={styles.activePlayerTimeEffects}>
        <TimeEffectsbar playerId={activeTargetId} />
      </div>
    </div>
  )
}