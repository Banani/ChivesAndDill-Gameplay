import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './PlayerIcon.module.scss';
import { getEngineState, selectActivePlayer } from '../../../stores';

export const PlayerIcon = ({ player }) => {
   const { name, absorb } = player;
   const engineState = useSelector(getEngineState);
   const activePlayerId = useSelector(selectActivePlayer);

   const [absorbBar, updateAbsortBar] = useState(0);

   const playerPoints = engineState.characterPowerPoints.data[activePlayerId];

   useEffect(() => {
      if (!playerPoints) {
         return;
      }

      if ((absorb / playerPoints.maxHp) * 100 > 100) {
         updateAbsortBar(100);
      } else {
         updateAbsortBar((absorb / playerPoints.maxHp) * 100);
      }
   }, [absorb, playerPoints]);

   if (!playerPoints) {
      return <></>;
   }

   const { maxHp, currentHp, currentSpellPower, maxSpellPower } = playerPoints;

   return (
      <div>
         <div className={styles.playerIconContainer}>
            <div className={styles.playerAvatar}></div>
            <div className={styles.playerLvl}>69</div>
            <div className={styles.playerRole} />
            <div className={styles.barsContainer}>
               <div className={styles.nameBar}>{name}</div>
               <div className={styles.bar}>
                  <div className={styles.barText}>{currentHp >= 0 ? currentHp + '/' + maxHp : 0}</div>
                  <div className={styles.hpColor} style={{ width: currentHp >= 0 ? (currentHp / maxHp) * 100 + '%' : '0' }}></div>
                  <div className={styles.absorbColor} style={{ width: absorbBar + '%' }}></div>
               </div>
               <div className={styles.bar}>
                  <div className={styles.barText}>{currentSpellPower >= 0 ? currentSpellPower + '/' + maxSpellPower : 0}</div>
                  <div className={styles.manaColor} style={{ width: currentSpellPower >= 0 ? (currentSpellPower / maxSpellPower) * 100 + '%' : '0' }}></div>
               </div>
            </div>
         </div>
         <div></div>
      </div>
   );
};
