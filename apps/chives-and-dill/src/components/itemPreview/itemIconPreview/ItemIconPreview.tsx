import { MoneyBar } from 'apps/chives-and-dill/src/app/guiContent/moneyBar/MoneyBar';
import React, { useRef } from 'react';
import styles from '../itemIconPreview/ItemIconPreview.module.scss';

enum Dimension {
    HEIGHT = "height",
    WIDTH = "width"
};

export const ItemIconPreview = ({ itemData, highlight, showMoney }) => {

    const tooltipContainer = useRef<HTMLDivElement>(null);
    const tooltip = useRef<HTMLDivElement>(null);

    const checkIfStatIsAvailable = (stat, type) => {
        if(stat !== 0 && stat !== undefined && type !== 'Armor') {
            return (<div>{'+ ' + stat + ' ' + type}</div>)
        } else if(stat !== 0 && stat !== undefined && type === 'Armor') {
            return (<div>{stat + ' ' + type}</div>)
        } else {
            return null;
        };
    };

    const checkIfObjectIsInScreen = (dimension: Dimension) => {
        const { x, y } = tooltipContainer.current?.getBoundingClientRect() || {};
        const { width, height } = tooltip.current?.getBoundingClientRect() || {};

        const positionOfContainer = dimension === Dimension.HEIGHT ? y : x;
        const sizeOfObject = dimension === Dimension.HEIGHT ? height : width;

        const windowDimension = dimension === Dimension.HEIGHT ? window.innerHeight : window.outerWidth;

        return positionOfContainer - sizeOfObject > 0 && positionOfContainer + sizeOfObject < windowDimension;
    };

    const getPositionForElement = (dimension: Dimension) => {
        const { height: containerHeight, width: containerWidth } = tooltipContainer?.current?.getBoundingClientRect() || {};
        const { height: tooltipHeight, width: tooltipWidth } = tooltip?.current?.getBoundingClientRect() || {};
        const containerSize = dimension === Dimension.HEIGHT ? containerHeight : containerWidth;
        const tooltipSize = dimension === Dimension.HEIGHT ? tooltipHeight : tooltipWidth;

        if (checkIfObjectIsInScreen(dimension)) {
            return containerSize;
        }

        return -tooltipSize;
    };

    return (
        <div style={{ backgroundImage: `url(${itemData.image})` }} ref={tooltipContainer} className={styles.ItemImage + ` ${highlight ? styles.highlight : null}`} >
            <div
                className={styles.ItemPreviewTooltip}
                ref={tooltip}
                style={{ bottom: getPositionForElement(Dimension.HEIGHT), left: getPositionForElement(Dimension.WIDTH) }}
            >
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
                {showMoney ? <div className={styles.ItemPrevTooltipPrice}>Sell price: <MoneyBar currency={itemData.value} /></div> : null}
            </div>
            {itemData.stack > 1 ? <div className={styles.Stack}>{itemData.stack}</div> : null}
        </div>
    )
}

