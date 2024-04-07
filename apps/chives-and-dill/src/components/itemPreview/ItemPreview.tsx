import { ItemTemplate } from '@bananos/types';
import React, { FunctionComponent } from 'react';
import { MoneyBar } from '../../app/guiContent/moneyBar/MoneyBar';
import styles from './ItemPreview.module.scss';
import { ItemIconPreview } from './itemIconPreview/ItemIconPreview';

export enum ItemPreviewHighlight {
    none = 'none',
    full = 'full',
    icon = 'icon',
}

export interface ItemPreviewProps {
    itemTemplate: ItemTemplate;
    showMoney: boolean;
    highlight: ItemPreviewHighlight;
    handleItemClick?: () => void;
    amount?: boolean;
}

export const ItemPreview: FunctionComponent<ItemPreviewProps> = ({ itemTemplate, handleItemClick, showMoney, highlight }) => {
    return (
        <div className={styles.Item + ` ${highlight === ItemPreviewHighlight.full ? styles.highlight : null}`} onClick={() => handleItemClick()}>
            <ItemIconPreview itemTemplate={itemTemplate} highlight={ItemPreviewHighlight.icon} showMoney={false} />
            <div className={styles.ItemInfoWrapper}>
                <div className={styles.ItemText}>{itemTemplate.name}</div>
                {showMoney ? <MoneyBar currency={itemTemplate.value} /> : null}
            </div>
        </div>
    );
};
