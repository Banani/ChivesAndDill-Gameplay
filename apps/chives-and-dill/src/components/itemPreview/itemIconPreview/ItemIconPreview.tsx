import { ItemTemplate } from '@bananos/types';
import React from 'react';
import { ItemPreviewHighlight } from '../ItemPreview';
import styles from '../itemIconPreview/ItemIconPreview.module.scss';
import { ItemPreviewTooltip, TooltipShowMode } from '../itemPreviewTooltip/ItemPreviewTooltip';

export interface ItemIconPreviewProps {
    itemTemplate: ItemTemplate;
    showMoney: boolean;
    highlight: ItemPreviewHighlight;
    handleItemRightClick?: () => void;
    amount?: number;
}

export const ItemIconPreview: React.FC<ItemIconPreviewProps> = ({ itemTemplate, highlight, showMoney, handleItemRightClick, amount = 0 }) => {
    return (
        <ItemPreviewTooltip showMode={TooltipShowMode.Hover} itemTemplate={itemTemplate} showMoney={showMoney} >
            <div
                style={{ backgroundImage: `url(${itemTemplate.image})` }}
                className={styles.ItemImage + ` ${highlight ? styles.highlight : ''}`}
                onContextMenu={e => {
                    e.preventDefault();
                    handleItemRightClick?.()
                }}
            >
                {amount && itemTemplate.stack > 1 ? <div className={styles.Stack}>{amount}</div> : null}
            </div>
        </ItemPreviewTooltip>
    );
};
