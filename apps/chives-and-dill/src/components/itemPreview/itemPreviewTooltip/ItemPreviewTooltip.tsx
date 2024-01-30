import { MoneyBar } from "apps/chives-and-dill/src/app/guiContent/moneyBar/MoneyBar";
import React from "react";
import { ItemPreviewProps } from "../ItemPreview";
import styles from './ItemPreviewTooltip.module.scss';

export const ItemPreviewTooltip: React.FC<ItemPreviewProps> = ({ showMoney, itemData }) => {

    const renderPrimatyStat = (stat, type) => {
        return stat ? <div>{'+ ' + stat + ' ' + type}</div> : null;
    };

    const renderSecondaryStat = (stat, type) => {
        return stat ? <div>{stat + " " + type}</div> : null;
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
                {renderPrimatyStat(itemData.agility, 'Agility')}
                {renderPrimatyStat(itemData.intelect, 'Intelect')}
                {renderPrimatyStat(itemData.strength, 'Strength')}
                {renderPrimatyStat(itemData.spirit, 'Spirit')}
                {renderPrimatyStat(itemData.stamina, 'Stamina')}
            </div>
            {showMoney ? 
                <div className={styles.ItemPrevTooltipPrice}>
                    Sell price: <MoneyBar currency={itemData.value} />
                </div>
            : null}
        </div>
    )
};