import React, { useEffect, useState } from 'react';
import styles from './MoneyBar.module.scss';
import copperImage from './images/copper.png';
import silverImage from './images/silver.png';
import goldImage from './images/gold.png';

export const MoneyBar = ({ currency, activePlayerId }) => {
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
      const goldAmount = Math.floor(currency[activePlayerId] / 10000);
      const silverAmount = Math.floor((currency[activePlayerId] % 10000) / 100);
      const copperAmount = currency[activePlayerId] % 100;

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
   }, [activePlayerId, currency]);

   const renderCoin = (type) => {
      return (
         <div className={styles.MoneyTypeContainer}>
            {type.amount !== null ? (
               <>
                  <div className={styles.MoneyAmount}>{type.amount}</div>
                  <img className={styles.MoneyType} src={type.image} alt={''} />
               </>
            ) : null}
         </div>
      );
   };

   return (
      <div className={styles.MoneyBar}>
         {renderCoin(coins.gold)}
         {renderCoin(coins.silver)}
         {renderCoin(coins.copper)}
      </div>
   );
};
