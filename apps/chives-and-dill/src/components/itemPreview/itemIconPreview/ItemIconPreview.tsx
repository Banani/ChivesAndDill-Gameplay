import React, { useState } from 'react';
import styles from '../itemIconPreview/ItemIconPreview.module.scss';
import { ItemPreviewTooltip } from '../itemPreviewTooltip/ItemPreviewTooltip';
import { ItemPreviewProps } from '../ItemPreview';

export const ItemIconPreview: React.FC<ItemPreviewProps> = ({ itemData, highlight }) => {
    const [isTooltipVisible, setTooltipVisible] = useState(false);

    return (
        <div 
            style={{ backgroundImage: `url(${itemData.image})` }} 
            className={styles.ItemImage + ` ${highlight ? styles.highlight : null}`} 
            onMouseEnter={(): void => setTooltipVisible(true)}
            onMouseLeave={(): void => setTooltipVisible(false)}
        >
            {isTooltipVisible ? 
                <ItemPreviewTooltip 
                    itemData={itemData} 
                />
            : null}
            {itemData.stack ? 
                <div className={styles.Stack}>
                    {itemData.stack}
                </div> 
            : null}
        </div>
    )
};

