import React, { useContext, useEffect, useState } from 'react';
import styles from './SpellsBar.module.scss';
import { useSelector } from 'react-redux';
import { selectCharacters, selectActiveCharacterId } from '../../../stores';
import _ from 'lodash';
import { GameControllerContext } from '../../gameController/gameControllerContext';

export const SpellsBar = () => {
   const context = useContext(GameControllerContext);
   const characters = useSelector(selectCharacters);
   const activePlayerId = useSelector(selectActiveCharacterId);
   const spells = characters[activePlayerId].spells;

   const [spellsOnCooldown, setSpellOnCooldown] = useState([]);
   const [clickedSpell, setClickedSpell] = useState('');

   let renderSpells;

   let keyBinds = _.map(characters[activePlayerId].spells, (spell) => spell.name);
   keyBinds = keyBinds.reduce((prev, current, index) => {
      prev[index + 1] = current;
      return prev;
   }, {});

   useEffect(() => {
      _.forIn(context, function (value, key) {
         if (keyBinds[key] && value) {
            const spell = [keyBinds[key]];
            setSpellOnCooldown([...spellsOnCooldown, ...spell.filter((c) => !spellsOnCooldown.includes(c))]);

            setClickedSpell(spell[0]);
         }
      });
   }, [context]);

   useEffect(() => {
      if (spellsOnCooldown.includes(clickedSpell) && clickedSpell !== '') {
         setTimeout(() => {
            setSpellOnCooldown(spellsOnCooldown.filter((item) => item !== clickedSpell));
            setClickedSpell('');
         }, spells[clickedSpell].cooldown);
      }
   }, [clickedSpell]);

   const colorOfSpellBorder = (spell) => {
      if (spellsOnCooldown.includes(spell.name)) {
         return 'silver';
      } else {
         return 'black';
      }
   };

   if (Object.keys(spells).length) {
      let i = 0;
      renderSpells = _.map(spells, (spell, key) => {
         i++;
         const activeSpell = spell;
         return (
            <div key={key} className={styles.spellContainer}>
               <div className={styles.keyboardNumber}>{i}</div>
               <img
                  src={activeSpell.image}
                  style={{ borderColor: `${colorOfSpellBorder(activeSpell)}` }}
                  className={styles.spellImage + ' ' + `${context[key] ? styles.activeSpell : null}`}
                  alt={activeSpell.name}
               />
               <div className={styles.spellTooltip}>
                  <div>{activeSpell.name}</div>
                  <div>
                     <div>{activeSpell.spellPowerCost} Mana</div>
                     <div>{activeSpell.range} yd range</div>
                  </div>
                  <div>{activeSpell.channelTime ? `${activeSpell.channelTime / 1000} sec cast` : 'Instant cast'}</div>
                  <div>{'Cooldown: ' + activeSpell.cooldown / 1000 + ' sec'}</div>
                  <div className={styles.spellDesc}>{activeSpell.description}</div>
               </div>
               {spellsOnCooldown.includes(activeSpell.name) ? (
                  <div className={styles.cooldown} style={{ animationDuration: `${activeSpell.cooldown / 1000}s` }}></div>
               ) : null}
            </div>
         );
      });
   }

   return <div className={styles.spellsBarContainer}>{renderSpells}</div>;
};
