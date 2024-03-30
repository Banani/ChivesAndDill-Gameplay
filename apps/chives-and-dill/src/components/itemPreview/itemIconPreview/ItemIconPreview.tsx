import React, { useState } from 'react';
import { ItemPreviewProps } from '../ItemPreview';
import styles from '../itemIconPreview/ItemIconPreview.module.scss';
import { ItemPreviewTooltip } from '../itemPreviewTooltip/ItemPreviewTooltip';

export const ItemIconPreview: React.FC<ItemPreviewProps> = ({ itemData, highlight, showMoney, showStackSize = true }) => {
   const [isTooltipVisible, setTooltipVisible] = useState(false);

   return (
      <div
         style={{ backgroundImage: `url(${itemData.image})` }}
         className={styles.ItemImage + ` ${highlight ? styles.highlight : ''}`}
         onMouseEnter={(): void => setTooltipVisible(true)}
         onMouseLeave={(): void => setTooltipVisible(false)}
      >
         {isTooltipVisible ? <ItemPreviewTooltip itemData={itemData} showMoney={showMoney} highlight={highlight} /> : null}
         {itemData.stack && showStackSize ? <div className={styles.Stack}>{itemData.stack}</div> : null}
      </div>
   );
};
