import React from 'react';
import styles from '../itemIconPreview/ItemIconPreview.module.scss';

export const ItemIconPreview = ({ itemData, highlight }) => {

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
        <div style={{ backgroundImage: `url(${itemData.image})` }} className={styles.ItemImage + ` ${highlight ? styles.highlight : null}`} >
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
            </div>
            {itemData.stack > 1 ? <div className={styles.Stack}>{itemData.stack}</div> : null}
        </div>
    )
}

