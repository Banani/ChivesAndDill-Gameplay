import { MoneyBar } from 'apps/chives-and-dill/src/app/guiContent/moneyBar/MoneyBar';
import React from 'react';
import { ItemPreviewProps } from '../ItemPreview';
import styles from './ItemPreviewTooltip.module.scss';

export const ItemPreviewTooltip: React.FC<ItemPreviewProps> = ({ showMoney, itemData }) => {
   const renderPrimaryStat = (value, name) => {
      return value ? <div>{'+ ' + value + ' ' + name}</div> : null;
   };

   const renderSecondaryStat = (value, name) => {
      return value ? <div>{value + ' ' + name}</div> : null;
   };

   return (
      <div className={styles.ItemPreviewTooltip}>
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
