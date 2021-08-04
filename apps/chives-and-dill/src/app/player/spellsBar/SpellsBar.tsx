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

  const [spellsOnCooldown, setSpellOnCooldown] = useState([]);
  const [clickedSpell, setClickedSpell] = useState("");

  let renderSpells;

  useEffect(() => {
    _.forIn(context, function (value, key) {
      if (keyBinds[key] && value) {
        const spell = [keyBinds[key]];
        setSpellOnCooldown([...spellsOnCooldown, ...spell.filter(c => !spellsOnCooldown.includes(c))]);
        setClickedSpell(...spell);
      }
    });
  }, [context])

  useEffect(() => {
    if (spellsOnCooldown.includes(clickedSpell) && clickedSpell !== "") {
      setTimeout(() => {
        setSpellOnCooldown(spellsOnCooldown.filter(item => item !== clickedSpell));
        setClickedSpell("")
      }, spells[clickedSpell].cooldown);
    }
  }, [spellsOnCooldown])

  const colorOfSpellBorder = (spell) => {
    if (spellsOnCooldown.includes(spell.name)) {
      return "silver"
    } else {
      return "black";
    }
  }

  if (Object.keys(spells).length) {
    renderSpells = _.map(keyBinds, (spell, index) => {
      const activeSpell = spells[spell];

      return (
        <div key={index} className={styles.spellContainer}>
          <div className={styles.keyboardNumber}>{index}</div>
          <img
            src={activeSpell.image}
            style={{ borderColor: `${colorOfSpellBorder(activeSpell)}` }}
            className={styles.spellImage + ' ' + `${context[index] ? styles.activeSpell : null}`}
            alt={activeSpell.name}
          />
          <div className={styles.spellTooltip}>
            <div>{activeSpell.name}</div>
            <div>{activeSpell.range} yd range</div>
            <div>{"Cooldown: " + activeSpell.cooldown / 1000 + " sec"}</div>
            <div className={styles.spellDesc}>{activeSpell.description}</div>
          </div>
          {spellsOnCooldown.includes(activeSpell.name) ?
            <div className={styles.cooldown} style={{ animationDuration: `${activeSpell.cooldown / 1000}s` }} ></div>
            : null}
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
