import { GlobalStoreModule } from '@bananos/types';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { GetAbsorbsValue } from '../../../player/GetPlayerAbsorbs';
import styles from './PlayerIcon.module.scss';
import { OptionsModal } from '../optionsModal/OptionsModal';
import { KeyBoardContext } from 'apps/chives-and-dill/src/contexts/KeyBoardContext';
import { useDispatch } from 'react-redux';
import { setActiveTarget } from 'apps/chives-and-dill/src/stores';

export const PlayerIcon = ({ playerId }) => {

   const ref = useRef<HTMLDivElement>(null);
   const keyBoardContext = useContext(KeyBoardContext);
   const dispatch = useDispatch();

   const { data: experience } = useEngineModuleReader(GlobalStoreModule.EXPERIENCE);
   const { data: characters } = useEngineModuleReader(GlobalStoreModule.CHARACTER);
   const { data: characterPowerPoints } = useEngineModuleReader(GlobalStoreModule.CHARACTER_POWER_POINTS);
   const { data: powerStacks } = useEngineModuleReader(GlobalStoreModule.POWER_STACKS);
   const { data: combatState } = useEngineModuleReader(GlobalStoreModule.COMBAT_STATE);

   const player = characters[playerId];
   const { name, avatar } = player;
   const playerAbsorb = GetAbsorbsValue(playerId);
   const [absorbBarWidth, setAbsorbBarWidth] = useState(0);
   const [optionsVisible, setOptionsVisible] = useState(false);

   const playerPoints = characterPowerPoints[playerId];
   const HolyPower = powerStacks?.[playerId]?.HolyPower;
   const { maxHp, currentHp, currentSpellPower, maxSpellPower } = playerPoints;

   useEffect(() => {
      if (!playerPoints) {
         return;
      }

      setAbsorbBarWidth((playerAbsorb / (playerAbsorb + playerPoints.maxHp)) * 100);
   }, [playerAbsorb, playerPoints]);

   if (!playerPoints) {
      return <></>;
   }

   const renderPowerStacks = (stacksType, amount) => {
      if (!amount) {
         return;
      }
      return Array.from(Array(amount).keys()).map((i) => <div className={styles.powerStackCircle} />);
   };

   const avatarClick = (e) => {
      e.preventDefault();
      setOptionsVisible(prevState => !prevState);
   }

   const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
         setOptionsVisible(false);
      }
   };

   const handleEscape = () => {
      if (optionsVisible) {
         setOptionsVisible(false);
      } else {
         dispatch(setActiveTarget({ characterId: null }))
      }
   };

   useEffect(() => {
      keyBoardContext.addKeyHandler({
         id: 'ExitOptions',
         matchRegex: 'Escape',
         keydown: () => handleEscape(),
      });

      return () => keyBoardContext.removeKeyHandler('ExitOptions');

   }, [optionsVisible]);

   useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside, true);

      return () => {
         document.removeEventListener('mousedown', handleClickOutside, true);
      };
   }, []);

   return (
      <div ref={ref}>
         <div className={styles.playerIconContainer}>
            <div onContextMenu={(e) => avatarClick(e)} className={styles.playerAvatar + " " + (combatState[playerId] ? styles.combatBorder : "")} style={{ backgroundImage: `url(${avatar})` }}></div>
            <div className={styles.combatSwords} style={combatState[playerId] ? { visibility: "visible", opacity: '1' } : null}></div>
            <div className={styles.playerLvl}>{experience[playerId].level}</div>
            <div className={styles.playerRole} />
            <div>
               <div className={styles.barsContainer + " " + (combatState[playerId] ? styles.combatBorder : "")}>
                  <div className={styles.nameBar}>{name}</div>
                  <div className={styles.bar}>
                     <div className={styles.barText}>{currentHp >= 0 ? currentHp + '/' + maxHp : 0}</div>
                     <div className={styles.hpColor} style={{ width: currentHp >= 0 ? (currentHp / (maxHp + playerAbsorb)) * 100 + '%' : '0' }}></div>
                     <div className={styles.absorbColor} style={{ width: absorbBarWidth + '%', left: `${(currentHp / (maxHp + playerAbsorb)) * 100}%` }}></div>
                  </div>
                  <div className={styles.bar}>
                     <div className={styles.barText}>{currentSpellPower >= 0 ? currentSpellPower + '/' + maxSpellPower : 0}</div>
                     <div className={styles.manaColor} style={{ width: currentSpellPower >= 0 ? (currentSpellPower / maxSpellPower) * 100 + '%' : '0' }}></div>
                  </div>
               </div>
               <div className={styles.powerStacks}>{renderPowerStacks('HolyPower', HolyPower)}</div>
            </div>
         </div>
         {optionsVisible && player.type === 'Player' ? <OptionsModal setOptionsVisible={setOptionsVisible} playerId={playerId} /> : null}
      </div>
   );
};
