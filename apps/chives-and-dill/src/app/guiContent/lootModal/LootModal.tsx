import { useItemTemplateProvider } from 'apps/chives-and-dill/src/hooks';
import _ from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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

  const { itemTemplates } = useItemTemplateProvider({ itemTemplateIds: _.map(activeLoot.items, (item) => item.itemTemplateId) ?? [] });

  const items = useMemo(
    () =>
      _.map(activeLoot.items, (item) => {
        const itemData = itemTemplates[item.itemTemplateId];
        if (itemData) {
          return (
            <div className={styles.Item}>
              <img src={itemData.image} className={styles.ItemImage} alt=""></img>
              <div className={styles.Stack}>{itemData.stack}</div>
              <div className={styles.RewardText}>{itemData.name}</div>
            </div>
          );
        }
      }),
    [activeLoot.items, itemTemplates]
  );

  return (
    mousePosition.x !== null ?
      <div className={styles.LootModal} style={{ top: `${mousePosition.y}px`, left: `${mousePosition.x}px` }}>
        {items && <div className={styles.ItemsContainer}>{items}</div>}
      </div> : null
  )
}