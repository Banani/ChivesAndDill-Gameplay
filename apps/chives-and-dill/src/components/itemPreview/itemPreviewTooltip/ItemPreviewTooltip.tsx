import { ItemTemplate, ItemTemplateType } from '@bananos/types';
import React, { useRef, useState } from 'react';
import { createPortal } from "react-dom";
import styles from './ItemPreviewTooltip.module.scss';
import { EquipmentTooltip } from './components/EquipmentTooltip';
import { GenericTooltip } from './components/GenericTooltip';

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

    const getTooltipContent = () => {
        switch (itemTemplate.type) {
            case ItemTemplateType.Equipment:
                return <EquipmentTooltip itemTemplate={itemTemplate} showMoney={showMoney} />;
            case ItemTemplateType.Generic:
                return <GenericTooltip itemTemplate={itemTemplate} showMoney={showMoney} />
            default:
                return <>Item type not supported.
                    Mikołaj kiedyś zrobi tak zeby był supported.</>
        }
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
                    {getTooltipContent()}
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
