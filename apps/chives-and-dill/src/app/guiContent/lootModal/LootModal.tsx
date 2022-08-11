import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import styles from "./LootModal.module.scss";

export const LootModal = ({ activeLoot }) => {
  const [mousePosition, setMousePosition] = useState({ x: null, y: null });

  const updateMousePosition = useCallback(
    (e) => {

      if (_.isEmpty(activeLoot)) {
        setMousePosition({ x: null, y: null });
      }

      if (mousePosition.x === null) {
        setMousePosition({ x: e.offsetX, y: e.offsetY });
      }
    },
    [mousePosition, activeLoot]
  );

  useEffect(() => {
    window.addEventListener('click', updateMousePosition);


    return () => window.removeEventListener('click', updateMousePosition);
  }, [activeLoot, updateMousePosition]);

  return (
    mousePosition.x !== null ?
      <div className={styles.LootModal} style={{ top: `${mousePosition.y}px`, left: `${mousePosition.x}px` }}>

      </div> : null
  )
}