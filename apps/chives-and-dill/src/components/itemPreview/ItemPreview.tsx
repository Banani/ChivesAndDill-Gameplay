import React, { FunctionComponent } from 'react';
import styles from './ItemPreview.module.scss';
import { ItemIconPreview } from './itemIconPreview/ItemIconPreview';
import { MoneyBar } from '../../app/guiContent/moneyBar/MoneyBar';
import { EquipmentItem } from '../../app/guiContent/characterEq/CharacterEq';

export enum ItemPreviewHighlight {
   none = 'none',
   full = 'full',
   icon = 'icon',
}

export interface ItemPreviewProps {
   itemData: EquipmentItem;
   showMoney: boolean;
   highlight: ItemPreviewHighlight;
   handleItemClick?: () => void;
   selectModal?: string;
}

export const ItemPreview: FunctionComponent<ItemPreviewProps> = ({ itemData, handleItemClick, showMoney, highlight }) => {
   return (
      <div className={styles.Item + ` ${highlight === ItemPreviewHighlight.full ? styles.highlight : null}`} onClick={() => handleItemClick()}>
         <ItemIconPreview itemData={itemData} highlight={ItemPreviewHighlight.icon} showMoney={false} />
         <div className={styles.ItemInfoWrapper}>
            <div className={styles.ItemText}>{itemData.name}</div>
            {showMoney ? <MoneyBar currency={itemData.value} /> : null}
         </div>
      </div>
   );
};
