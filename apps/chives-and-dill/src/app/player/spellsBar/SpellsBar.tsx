import React from 'react';
import styles from "./SpellsBar.module.scss";
import xd from "../../../assets/spritesheets/spells/potato.png";

export const SpellsBar = ({ player }) => {

  const { name, maxHp, currentHp } = player;

  const spells = [
    {
      id: "0",
      name: "Fireball",
      image: "../../../assets/spritesheets/spells/mage/fireball.jpg",
      description: "Inflicts Fire damage to an enemy and causes them to burn for 8 sec.",
      castTime: "2.5 sec cast",
      castRange: "40",
    },
    {
      id: "1",
      name: "Arcane Intellect",
      image: "../../../assets/spritesheets/spells/mage/arcaneIntellect.jpeg",
      description: "Infuses the target with brilliance, increasing their Intellect by 5% for 1 hour. If target is in your party or raid, all party and raid members will be affected.",
      castTime: "Instant",
      castRange: "30",
    },
    {
      id: "2",
      name: "Power Word: Shield",
      image: "../../../assets/spritesheets/spells/mage/shield.jpg",
      description: "Shields an ally for 15 sec, absorbing 300 damage.",
      castTime: "Channeled (2.5 sec cast)",
      castRange: "35",
    }
  ]

  const spellsToRender = spells.map(spell =>
    <div key={spell.id} className={styles.spellContainer}>
      <img src={spell.image} className={styles.spellImage} alt={spell.name} />
      <div className={styles.spellTooltip}>
        <div>{spell.name}</div>
        <div>{spell.castRange} yd range</div>
        <div>{spell.castTime}</div>
        <div className={styles.spellDesc}>{spell.description}</div>
      </div>
    </div>
  )

  return (
    <div className={styles.spellsBarContainer}>
      {spellsToRender}
    </div>
  )
}