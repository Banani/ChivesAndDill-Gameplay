import React, { useRef, useState } from 'react';
import { ItemPreviewProps } from '../ItemPreview';
import styles from '../itemIconPreview/ItemIconPreview.module.scss';
import { ItemPreviewTooltip } from '../itemPreviewTooltip/ItemPreviewTooltip';

export const ItemIconPreview: React.FC<ItemPreviewProps> = ({ itemData, highlight, showMoney, showStackSize = true }) => {
   const [isTooltipVisible, setTooltipVisible] = useState(false);
    const tooltipContainer = useRef<HTMLDivElement>(null);

   return (
      <div
         style={{ backgroundImage: `url(${itemData.image})` }}
           ref={tooltipContainer}
         className={styles.ItemImage + ` ${highlight ? styles.highlight : ''}`}
         onMouseEnter={(): void => setTooltipVisible(true)}
         onMouseLeave={(): void => setTooltipVisible(false)}
      >
           {isTooltipVisible ? <ItemPreviewTooltip itemData={itemData} showMoney={showMoney} highlight={highlight} tooltipContainer={tooltipContainer} /> : null}
         {itemData.stack && showStackSize ? <div className={styles.Stack}>{itemData.stack}</div> : null}
      </div>
   );
};
