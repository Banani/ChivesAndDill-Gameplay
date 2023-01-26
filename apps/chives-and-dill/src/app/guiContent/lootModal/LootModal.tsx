import { CommonClientMessages } from '@bananos/types';
import { useItemTemplateProvider } from 'apps/chives-and-dill/src/hooks';
import _ from 'lodash';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Button } from '../components/button/Button';
import { SocketContext } from '../../gameController/socketContext';
import styles from "./LootModal.module.scss";
import { CalculateCurrenty } from '../moneyBar/CalculateCurrency';
import { usePagination } from '../../../../../creator-web/src/app/mapEditor/spritePanel/components/usePagination';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface Item {
  amount: number,
  itemTemplateId: string,
}

export const LootModal = ({ activeLoot, monsterId }) => {
  const [mousePosition, setMousePosition] = useState({ x: null, y: null });
  const coinsTemplate = CalculateCurrenty(activeLoot.coins) as any;
  const [itemsAmount, updateItemsAmount] = useState(0);
  const [paginationRange, setPaginationRange] = useState({ start: 0, end: 0 });

  const context = useContext(SocketContext);
  const { socket } = context;

  const { start, end, prevPage, nextPage, page, allPagesCount } = usePagination({
    pageSize: 3,
    itemsAmount,
  });

  useEffect(() => {
    setPaginationRange({ start, end });
  }, [start, end]);

  useEffect(() => {
    if (activeLoot.coins) {
      updateItemsAmount(1 + _.size(activeLoot.items));
    } else {
      updateItemsAmount(_.size(activeLoot.items));
    }
  }, [activeLoot.items, activeLoot.coins]);

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

  // 1. zmapowac do jsx itemy.
  // 2. dodac coiny do tablicy z itemami
  // 3. slice

  const activeItems = () => {

    let items = _.map(activeLoot.items, (key, id) => {
      const item = activeLoot.items[id];
      const itemData = itemTemplates[item.itemTemplateId];
      return (
        < div className={styles.Item} onClick={() => handleItemClick(monsterId, item)}>
          <img src={itemData.image} className={styles.ItemImage} alt=""></img>
          <div className={styles.Stack}>{itemData.stack}</div>
          <div className={styles.RewardText}>{itemData.name}</div>
        </div>
      )
    });

    items = [coins(), ...items];

    if (itemsAmount > 3) {
      return Object.entries(items).slice(paginationRange.start, paginationRange.end).map(entry => entry[1]);
    } else {
      return items;
    }
  };

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
          {activeItems() && <div className={styles.ItemsContainer}>{activeItems()}</div>}
          <div className={styles.PaginationContainer}>
            {page !== 1 ?
              <div className={styles.PaginationSide}>
                <button className={styles.PaginationButton} onClick={prevPage}><ArrowUpwardIcon /></button>
                <div className={styles.PaginationText}>Prev</div>
              </div> : null}
            {page !== allPagesCount ? <div className={`${styles.PaginationSide} ${styles.RightPaginationSide}`}>
              <div className={styles.PaginationText}>Next</div>
              <button className={styles.PaginationButton} onClick={nextPage}><ArrowDownwardIcon /></button>
            </div> : null}
          </div>
        </div>
      </div> : null
  )
}