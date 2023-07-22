import React from 'react';
import styles from '../itemIconPreview/ItemIconPreview.module.scss';

export const ItemIconPreview = ({ itemData, highlight }) => {
console.log(itemData)
const checkIfStatIsAvailable =(stat, type)=>{
    return stat !== 0 && stat !== undefined ? <div>{type + ': ' + stat}</div> : null;
}
    return (
        <div style={{ backgroundImage: `url(${itemData.image})` }} className={styles.ItemImage + ` ${highlight ? styles.highlight : null}`} >
            <div className={styles.ItemPreviewTooltip}>
                <div className={styles.ItemPrevTooltipName}>{itemData.name}</div>
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
            </div>
            <div className={styles.Stack}>{itemData.stack}</div>
        </div>
    )
}

