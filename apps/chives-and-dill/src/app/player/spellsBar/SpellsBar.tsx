import React, { useContext, useEffect, useState } from 'react';
import styles from "./SpellsBar.module.scss";
import { useSelector } from 'react-redux';
import { selectSpells, selectKeyBinds } from '../../../stores';
import _ from 'lodash';
import { GameControllerContext } from "../../gameController/gameControllerContext";

export const SpellsBar = () => {

  const context = useContext(GameControllerContext);
  const spells = useSelector(selectSpells);
  const keyBinds = useSelector(selectKeyBinds);

  const [activeStyles, setActiveStyles] = useState({ width: "40px" });
  const [cooldownProgress, setCooldownProgress] = useState(3000);

  let renderSpells;

  useEffect(() => {
    const interval = setInterval(() => {
      if(cooldownProgress > 0) {
        setCooldownProgress(cooldownProgress - (1000 / 16));
        setActiveStyles({ width: `${(cooldownProgress / spells.Projectile.cooldown * 100) / 2}px`})
      }
    }, 1000 / 60);

    return () => {
      clearInterval(interval);
    };
  }, [spells, cooldownProgress]);

  if (Object.keys(spells).length) {
    renderSpells = _.map(keyBinds, (spell, index) => {
      const activeSpell = spells[spell];

      return (
        <div key={index} className={styles.spellContainer}>
          <div className={styles.keyboardNumber}>{index}</div>
          <img
            src={activeSpell.image}
            className={styles.spellImage + ' ' + `${context[index] ? styles.activeSpell : null}`}
            alt={activeSpell.name}
          />
          <div className={styles.spellTooltip}>
            <div>{activeSpell.name}</div>
            <div>{activeSpell.range} yd range</div>
            <div>{"Cooldown: " + activeSpell.cooldown / 1000 + " sec"}</div>
            <div className={styles.spellDesc}>{activeSpell.description}</div>
          </div>
          <div className={styles.cooldown} style={activeStyles}></div>
        </div>
      )
    });
  }

  return (
    <div className={styles.spellsBarContainer}>
      {renderSpells}
    </div>
  )
}