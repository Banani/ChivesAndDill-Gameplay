import React, { useEffect } from "react";
import styles from "./displayCooldown.module.scss";

export const DisplayCooldown = ({ usedSpell }) => {

  useEffect(() => {
    const timer = setTimeout(() => {
    }, 2000);
    return () => clearTimeout(timer);
  }, [usedSpell]);

  return (
    <div className={styles.displayCooldown}>
      {/* <svg className={styles.cooldown}>
        <path fill="none" stroke="red" stroke-width="2" d="
          M 0, 30
          a 25,25 0 1,1 60,0
          a 25,25 0 1,1 -60,0
        "/>
      </svg> */}

    </div>
  )
}