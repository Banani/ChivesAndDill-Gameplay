import React from 'react';
import styles from './TimeEffectsBar.module.scss';
import { getEngineState, selectActivePlayer } from '../../../stores';
import { useSelector } from 'react-redux';
import _ from "lodash";

export const TimeEffectsbar = () => {
   const engineState = useSelector(getEngineState);
   const activePlayerId = useSelector(selectActivePlayer);
   console.log(engineState.timeEffects.data)
   const debuffs = _.map(engineState.timeEffects.data, (debuff, i) => {
      if (debuff.targetId === activePlayerId) {
         return (
            <>
               <div key={debuff.id} className={styles.debuffImage} style={{ backgroundImage: `url(${debuff.iconImage})`, }}></div>
               <div className={styles.spellTooltip}>
                  <div>{debuff.name}</div>
                  <div>Period: {debuff.period / 1000} sec</div>
                  <div className={styles.spellDesc}>{debuff.description}</div>
               </div>
            </>
         )
      }
   });

   return <div className={styles.barContainer}>
      {debuffs}
   </div>;
};
