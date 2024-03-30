import { MoneyBar } from 'apps/chives-and-dill/src/app/guiContent/moneyBar/MoneyBar';
import React, { useRef } from 'react';
import { ItemPreviewProps } from '../ItemPreview';
import styles from './ItemPreviewTooltip.module.scss';

enum Dimension {
   HEIGHT = "height",
   WIDTH = "width"
};

export const ItemPreviewTooltip: React.FC<ItemPreviewProps> = ({ showMoney, itemData, tooltipContainer }) => {

   const tooltip = useRef<HTMLDivElement>(null);

   const renderPrimaryStat = (value, name) => {
      return value ? <div>{'+ ' + value + ' ' + name}</div> : null;
   };

   const renderSecondaryStat = (value, name) => {
      return value ? <div>{value + ' ' + name}</div> : null;
   };

   const checkIfObjectIsInScreen = (dimension: Dimension, tooltip) => {
      const { x, y } = tooltipContainer.current?.getBoundingClientRect() || {};
      const { width, height } = tooltip.current?.getBoundingClientRect() || {};

      const positionOfContainer = dimension === Dimension.HEIGHT ? y : x;
      const sizeOfObject = dimension === Dimension.HEIGHT ? height : width;

      const windowDimension = dimension === Dimension.HEIGHT ? window.innerHeight : window.outerWidth;

      //tutaj dodać kod dla innych przypadków
      return positionOfContainer - sizeOfObject > 0 && positionOfContainer + sizeOfObject < windowDimension;
   };

   const getPositionForElement = (dimension: Dimension, tooltip) => {
      const { height: containerHeight, width: containerWidth } = tooltipContainer?.current?.getBoundingClientRect() || {};
      const { height: tooltipHeight, width: tooltipWidth } = tooltip?.current?.getBoundingClientRect() || {};
      const containerSize = dimension === Dimension.HEIGHT ? containerHeight : containerWidth;
      const tooltipSize = dimension === Dimension.HEIGHT ? tooltipHeight : tooltipWidth;

      if (checkIfObjectIsInScreen(dimension, tooltip)) {
         return containerSize;
      }

      return -tooltipSize;
   };


   return (
      <div className={styles.ItemPreviewTooltip}
         ref={tooltip}
         style={{
            left: getPositionForElement(Dimension.WIDTH, tooltip),
            bottom: getPositionForElement(Dimension.HEIGHT, tooltip),
         }}
      >
         <div className={styles.ItemPrevTooltipName}>{itemData.name}</div>
         <div className={styles.ItemPrevTooltipLevel}>Item Level 1</div>
         <div className={styles.ItemPrevTooltipSlot}>
            <div>{itemData.slot}</div>
            <div>Cloth</div>
         </div>
         <div className={styles.ItemPrevTooltipStat}>
            {renderSecondaryStat(itemData.armor, 'Armor')}
            {renderPrimaryStat(itemData.agility, 'Agility')}
            {renderPrimaryStat(itemData.intelect, 'Intelect')}
            {renderPrimaryStat(itemData.strength, 'Strength')}
            {renderPrimaryStat(itemData.spirit, 'Spirit')}
            {renderPrimaryStat(itemData.stamina, 'Stamina')}
         </div>
         {showMoney ? (
            <div className={styles.ItemPrevTooltipPrice}>
               Sell price: <MoneyBar currency={itemData.value} />
            </div>
         ) : null}
      </div>
   );
};
