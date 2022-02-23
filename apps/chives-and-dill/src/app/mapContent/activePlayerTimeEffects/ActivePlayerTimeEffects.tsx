import React from 'react';
import { TimeEffectsbar } from '../../guiContent/timeEffectsBar/TimeEffectsBar';
import styles from './ActivePlayerTimeEffects.module.scss';

export const ActivePlayerTimeEffects = ({ playerId }) => (
   <div className={styles.activePlayerTimeEffects}>
      <TimeEffectsbar playerId={playerId} />
   </div>
);
