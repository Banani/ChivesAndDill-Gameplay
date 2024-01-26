import React from "react";
import styles from './ItemPreviewTooltip.module.scss';
import { MoneyBar } from "apps/chives-and-dill/src/app/guiContent/moneyBar/MoneyBar";
import { ItemPreviewProps } from "../ItemPreview";

export const ItemPreviewTooltip: React.FC<ItemPreviewProps> = ({ showMoney, itemData }) => {
    
    const checkIfStatIsAvailable = (stat, type) => {
        if(stat !== 0 && stat !== undefined && type !== 'Armor') {
            return (<div>{'+ ' + stat + ' ' + type}</div>)
        } else if(stat !== 0 && stat !== undefined && type === 'Armor') {
            return (<div>{stat + ' ' + type}</div>)
        } else {
            return null;
        };
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
                {checkIfStatIsAvailable(itemData.armor, 'Armor')}
                {checkIfStatIsAvailable(itemData.agility, 'Agility')}
                {checkIfStatIsAvailable(itemData.intelect, 'Intelect')}
                {checkIfStatIsAvailable(itemData.strength, 'Strength')}
                {checkIfStatIsAvailable(itemData.spirit, 'Spirit')}
                {checkIfStatIsAvailable(itemData.stamina, 'Stamina')}
            </div>
            {showMoney ? 
                <div className={styles.ItemPrevTooltipPrice}>
                    Sell price: <MoneyBar currency={itemData.value} />
                </div>
            : null}
        </div>
    )
};