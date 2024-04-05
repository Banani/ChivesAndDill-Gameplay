import { ItemTemplate, ItemTemplateType } from '@bananos/types';
import { MoneyBar } from 'apps/chives-and-dill/src/app/guiContent/moneyBar/MoneyBar';
import React from 'react';
import styles from './ItemPreviewTooltip.module.scss';

export interface ItemPreviewTooltipProps {
    itemTemplate: ItemTemplate;
    showMoney: boolean;
}

export const ItemPreviewTooltip: React.FC<ItemPreviewTooltipProps> = ({ showMoney, itemTemplate }) => {
    const renderPrimaryStat = (value, name) => {
        return value ? <div>{'+ ' + value + ' ' + name}</div> : null;
    };

    const renderSecondaryStat = (value, name) => {
        return value ? <div>{value + ' ' + name}</div> : null;
    };

    if (itemTemplate.type != ItemTemplateType.Equipment) {
        return <div className={styles.ItemPreviewTooltip}>
            Item type not supported.
            Mikołaj kiedyś zrobi tak zeby był supported.
        </div>
    }


    return (
        <div className={styles.ItemPreviewTooltip}>
            <div className={styles.ItemPrevTooltipName}>{itemTemplate.name}</div>
            <div className={styles.ItemPrevTooltipLevel}>Item Level 1</div>
            <div className={styles.ItemPrevTooltipSlot}>
                <div>{itemTemplate.slot}</div>
                <div>Cloth</div>
            </div>
            <div className={styles.ItemPrevTooltipStat}>
                {renderSecondaryStat(itemTemplate.armor, 'Armor')}
                {renderPrimaryStat(itemTemplate.agility, 'Agility')}
                {renderPrimaryStat(itemTemplate.intelect, 'Intelect')}
                {renderPrimaryStat(itemTemplate.strength, 'Strength')}
                {renderPrimaryStat(itemTemplate.spirit, 'Spirit')}
                {renderPrimaryStat(itemTemplate.stamina, 'Stamina')}
            </div>
            {showMoney ? (
                <div className={styles.ItemPrevTooltipPrice}>
                    Sell price: <MoneyBar currency={itemTemplate.value} />
                </div>
            ) : null}
        </div>
    );
};
