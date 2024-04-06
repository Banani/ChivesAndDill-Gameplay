import { ItemTemplate, ItemTemplateType } from '@bananos/types';
import { MoneyBar } from 'apps/chives-and-dill/src/app/guiContent/moneyBar/MoneyBar';
import React, { useRef, useState } from 'react';
import { createPortal } from "react-dom";
import styles from './ItemPreviewTooltip.module.scss';

export enum TooltipShowMode {
    Click = "Click",
    Hover = "Hover"
}

export interface ItemPreviewTooltipProps {
    itemTemplate: ItemTemplate;
    showMoney: boolean;
    showMode: TooltipShowMode;
    children?: React.ReactNode;
}

export const ItemPreviewTooltip: React.FC<ItemPreviewTooltipProps> = ({ showMoney, itemTemplate, showMode, children }) => {
    const tooltip = useRef<HTMLDivElement>(null);
    const container = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

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

    const getTopPosition = () => {
        const { top: containerTop, height: containerHeight } = container?.current?.getBoundingClientRect() || {};
        const { height: tooltipHeight } = tooltip?.current?.getBoundingClientRect() || {};

        if (!tooltipHeight) {
            return "200%";
        }

        const position = containerTop - tooltipHeight;

        if (position < 10) {
            return containerTop + containerHeight + "px";
        }

        return position + "px";
    }

    const getLeftPosition = () => {
        const { left: containerLeft, width: containerWidth } = container?.current?.getBoundingClientRect() || {};
        const { width: tooltipWidth } = tooltip?.current?.getBoundingClientRect() || {};

        const position = containerLeft + containerWidth

        if (position + tooltipWidth > window.innerWidth - 10) {
            return containerLeft - tooltipWidth;
        }

        return position + "px";
    }

    return (
        <>
            {visible ?
                createPortal(<div
                    className={styles.ItemPreviewTooltip}
                    ref={tooltip}
                    style={{
                        left: getLeftPosition(),
                        top: getTopPosition(),
                    }}
                >
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
                </div>, document.getElementById("root")) : null}
            <div className={styles.childWrapper} ref={container}
                onMouseEnter={() => {
                    if (showMode === TooltipShowMode.Hover) {
                        setVisible(true)
                    }
                }}
                onMouseDown={() => {
                    if (showMode === TooltipShowMode.Click) {
                        setVisible(prev => !prev)
                    }
                }}
                onMouseLeave={() => {
                    setVisible(false)
                }}
            >
                {children}
            </div>
        </>
    );
};
