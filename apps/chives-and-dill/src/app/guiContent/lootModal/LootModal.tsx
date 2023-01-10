import { CommonClientMessages } from '@bananos/types';
import { useItemTemplateProvider } from 'apps/chives-and-dill/src/hooks';
import _ from 'lodash';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Button } from '../components/button/Button';
import { SocketContext } from '../../gameController/socketContext';
import styles from "./LootModal.module.scss";
import { CalculateCurrenty } from '../moneyBar/CalculateCurrency';

export const LootModal = ({ activeLoot, monsterId }) => {
  const [mousePosition, setMousePosition] = useState({ x: null, y: null });
  const coinsTemplate = CalculateCurrenty(activeLoot.coins) as any;

  const context = useContext(SocketContext);
  const { socket } = context;

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

  const handleItemClick = (corpseId, itemId) => {
    socket?.emit(CommonClientMessages.PickItemFromCorpse, {
      corpseId,
      itemId
    });
  };

  const handleCoinsClick = (corpseId) => {
    socket?.emit(CommonClientMessages.PickCoinsFromCorpse, {
      corpseId
    });
  };

  const coinAmount = (type) => {
    if (type.amount) {
      return type.amount ? <div>{type.amount + ' ' + type.text}</div> : null;
    }
  };

  const coinImage = (coins) => {
    if (coins.gold.amount) {
      return coins.gold.image;
    }

    if (coins.silver.amount) {
      return coins.silver.image;
    }

    return coins.copper.image;
  };

  const coins = () => {
    if (activeLoot.coins) {
      return (
        <div className={styles.Item} onClick={() => handleCoinsClick(monsterId)}>
          <img src={coinImage(coinsTemplate)} className={styles.ItemImage} alt=""></img>
          <div className={styles.RewardText}>
            {coinAmount(coinsTemplate.gold)}
            {coinAmount(coinsTemplate.silver)}
            {coinAmount(coinsTemplate.copper)}
          </div>
        </div>
      );
    }
  };

  const items = useMemo(
    () =>
      _.map(activeLoot.items, (item, itemId) => {
        const itemData = itemTemplates[item.itemTemplateId];
        if (itemData) {
          return (
            < div className={styles.Item} onClick={() => handleItemClick(monsterId, itemId)}>
              <img src={itemData.image} className={styles.ItemImage} alt=""></img>
              <div className={styles.Stack}>{itemData.stack}</div>
              <div className={styles.RewardText}>{itemData.name}</div>
            </div >
          )
        }
      }),
    [activeLoot.items, itemTemplates]
  );

  return (
    mousePosition.x !== null ?
      <div>

        <div className={styles.LootModal} style={{ top: `${mousePosition.y}px`, left: `${mousePosition.x}px` }}>
          <div className={styles.LootModalButton}>
            <Button className={styles.closeButton} onClick={() => {
              socket?.emit(CommonClientMessages.CloseLoot, {});
            }}>
              X
            </Button>
          </div>
          {items && <div className={styles.ItemsContainer}>{coins()}{items}</div>}
        </div>
      </div> : null
  )
}