import React from 'react';
import { CalculateCurrenty } from './CalculateCurrency';
import styles from './MoneyBar.module.scss';

export const MoneyBar = ({ currency }) => {
    const coins = CalculateCurrenty(currency);

    const renderCoin = (type) => (
        <div className={styles.MoneyTypeContainer}>
            {type.amount ? (
                <>
                    <div className={styles.MoneyAmount}>{type.amount}</div>
                    <img className={styles.MoneyType} src={type.image} alt={''} />
                </>
            ) : null}
        </div>
    );

    return (
        <div className={styles.MoneyBar}>
            {renderCoin(coins.gold)}
            {renderCoin(coins.silver)}
            {renderCoin(coins.copper)}
        </div>
    );
};
