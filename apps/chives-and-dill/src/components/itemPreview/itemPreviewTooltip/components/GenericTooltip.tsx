

import { GenericItemTemplate } from '@bananos/types';
import { MoneyBar } from 'apps/chives-and-dill/src/app/guiContent/moneyBar/MoneyBar';
import React from 'react';
import styles from "./shared.module.scss";

interface GenericTooltipProps {
    itemTemplate: GenericItemTemplate;
    showMoney: boolean;
}

export const GenericTooltip: React.FunctionComponent<GenericTooltipProps> = ({ itemTemplate, showMoney }) => {

    return (<> <div className={styles.ItemPrevTooltipName}>{itemTemplate.name}</div>
        {showMoney ? (
            <div className={styles.ItemPrevTooltipPrice}>
                Sell price: <MoneyBar currency={itemTemplate.value} />
            </div>
        ) : null}
    </>)
}