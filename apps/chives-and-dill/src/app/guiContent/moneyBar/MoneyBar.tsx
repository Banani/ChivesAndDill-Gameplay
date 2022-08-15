import React, { useEffect, useState } from 'react';
import copperImage from './images/copper.png';
import goldImage from './images/gold.png';
import silverImage from './images/silver.png';
import styles from './MoneyBar.module.scss';

export const MoneyBar = ({ currency }) => {
   const [coins, updateCoins] = useState({
      gold: {
         amount: null,
         image: goldImage,
         alt: 0,
      },
      silver: {
         amount: null,
         image: silverImage,
         alt: 0,
      },
      copper: {
         amount: null,
         image: copperImage,
         alt: 0,
      },
   });

   useEffect(() => {
      const goldAmount = Math.floor(currency / 10000);
      const silverAmount = Math.floor((currency % 10000) / 100);
      const copperAmount = currency % 100;

      updateCoins((prevState) => ({
         ...prevState,
         gold: {
            ...prevState.gold,
            amount: goldAmount ? goldAmount : null,
         },
         silver: {
            ...prevState.silver,
            amount: silverAmount || goldAmount ? silverAmount : null,
            alt: goldAmount ? 0 : null,
         },
         copper: {
            ...prevState.copper,
            amount: copperAmount,
         },
      }));
   }, [currency]);

   const renderCoin = (type) => (
      <div className={styles.MoneyTypeContainer}>
         {type.amount !== null ? (
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
