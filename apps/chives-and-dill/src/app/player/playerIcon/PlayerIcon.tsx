import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './PlayerIcon.module.scss';
import { getEngineState, selectCharacters } from '../../../stores';
import { TimeEffectsbar } from '../timeEffectsBar/TimeEffectsBar';
import _ from "lodash";

export const PlayerIcon = ({ playerId }) => {

   const engineState = useSelector(getEngineState);
   const players = useSelector(selectCharacters);
   const player = players[playerId];
   const { name, avatar } = player;
   const [activeShields, setActiveShields] = useState(0);
   const [absorbSpells, setAbsorbSpells] = useState([]);
   const [absorbBarWidth, setAbsorbBarWidth] = useState(0);

   const playerPoints = engineState.characterPowerPoints.data[playerId];

   useEffect(() => {
      const playerAbsorbSpells = _.filter(engineState.absorbShields.data, function (value, key) {
         return value.ownerId === player.id;
      });
      setAbsorbSpells(new Array(...playerAbsorbSpells));
   }, [engineState.absorbShields.data, player.id]);

   useEffect(() => {
      if (absorbSpells.length) {
         absorbSpells.forEach((key) => {
            setActiveShields(key.value);
         });
      } else {
         setActiveShields(0);
      }
   }, [absorbSpells]);

   useEffect(() => {
      if (!playerPoints) {
         return;
      }

      setAbsorbBarWidth((activeShields / (activeShields + playerPoints.maxHp)) * 100);

   }, [activeShields, playerPoints]);

   if (!playerPoints) {
      return <></>;
   }

   const { maxHp, currentHp, currentSpellPower, maxSpellPower } = playerPoints;

   return (
      <div>
         <div className={styles.playerIconContainer}>
            <div className={styles.playerAvatar} style={{ backgroundImage: `url(${avatar})` }}></div>
            <div className={styles.playerLvl}>69</div>
            <div className={styles.playerRole} />
            <div className={styles.barsContainer}>
               <div className={styles.nameBar}>{name}</div>
               <div className={styles.bar}>
                  <div className={styles.barText}>{currentHp >= 0 ? currentHp + '/' + maxHp : 0}</div>
                  <div className={styles.hpColor} style={{ width: currentHp >= 0 ? (currentHp / maxHp) * 100 + '%' : '0' }}></div>
                  <div className={styles.absorbColor} style={{ width: absorbBarWidth + '%' }}></div>
               </div>
               <div className={styles.bar}>
                  <div className={styles.barText}>{currentSpellPower >= 0 ? currentSpellPower + '/' + maxSpellPower : 0}</div>
                  <div className={styles.manaColor} style={{ width: currentSpellPower >= 0 ? (currentSpellPower / maxSpellPower) * 100 + '%' : '0' }}></div>
               </div>
            </div>
         </div>
         <TimeEffectsbar playerId={playerId} />
      </div>
   );
};
