import { ItemTemplate } from '@bananos/types';
import React, { useState } from 'react';
import { ItemPreviewHighlight } from '../ItemPreview';
import styles from '../itemIconPreview/ItemIconPreview.module.scss';
import { ItemPreviewTooltip } from '../itemPreviewTooltip/ItemPreviewTooltip';

export interface ItemIconPreviewProps {
    itemTemplate: ItemTemplate;
    showMoney: boolean;
    highlight: ItemPreviewHighlight;
    handleItemClick?: () => void;
    showStackSize?: boolean;
}

export const ItemIconPreview: React.FC<ItemIconPreviewProps> = ({ itemTemplate, highlight, showMoney, showStackSize = true }) => {
    const [isTooltipVisible, setTooltipVisible] = useState(false);

    return (
        <div
            style={{ backgroundImage: `url(${itemTemplate.image})` }}
            className={styles.ItemImage + ` ${highlight ? styles.highlight : ''}`}
            onMouseEnter={(): void => setTooltipVisible(true)}
            onMouseLeave={(): void => setTooltipVisible(false)}
        >
            {isTooltipVisible ? <ItemPreviewTooltip itemTemplate={itemTemplate} showMoney={showMoney} /> : null}
            {itemTemplate.stack && showStackSize ? <div className={styles.Stack}>{itemTemplate.stack}</div> : null}
        </div>
    );
};
