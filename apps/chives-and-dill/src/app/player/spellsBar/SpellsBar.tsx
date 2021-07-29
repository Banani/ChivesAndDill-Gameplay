import React, { useContext } from 'react';
import styles from './SpellsBar.module.scss';
import { useSelector } from 'react-redux';
import { selectSpells, selectKeyBinds } from '../../../stores';
import _ from 'lodash';
import { GameControllerContext } from '../../gameController/gameControllerContext';
import { DisplayCooldown } from './displayCooldown/displayCooldown';

export const SpellsBar = () => {
   const context = useContext(GameControllerContext);
   const spells = useSelector(selectSpells);
   const keyBinds = useSelector(selectKeyBinds);

   let renderSpells;

   if (Object.keys(spells).length) {
      renderSpells = _.map(keyBinds, (spell, index) => {
         const activeSpell = spells[spell];

         return (
            <div key={index} className={styles.spellContainer}>
               <div className={styles.keyboardNumber}>{index}</div>
               <img src={activeSpell.image} className={styles.spellImage + ' ' + `${context[index] ? styles.activeSpell : null}`} alt={activeSpell.name} />
               <div className={styles.spellTooltip}>
                  <div>{activeSpell.name}</div>
                  <div>{activeSpell.range} yd range</div>
                  <div>{'Cooldown: ' + activeSpell.cooldown / 1000 + ' sec'}</div>
                  <div className={styles.spellDesc}>{activeSpell.description}</div>
               </div>
               <DisplayCooldown usedSpell={spells.Projectile} />
            </div>
         );
      });
   }

   return <div className={styles.spellsBarContainer}>{renderSpells}</div>;
};
