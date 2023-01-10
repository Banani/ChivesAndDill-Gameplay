import { useEffect, useState } from 'react';
import copperImage from './images/copper.png';
import goldImage from './images/gold.png';
import silverImage from './images/silver.png';

export const CalculateCurrenty = (currency) => {

   const [coins, updateCoins] = useState({
      gold: {
         amount: null,
         image: goldImage,
         alt: 0,
         text: 'Gold',
      },
      silver: {
         amount: null,
         image: silverImage,
         alt: 0,
         text: 'Silver',
      },
      copper: {
         amount: null,
         image: copperImage,
         alt: 0,
         text: 'Copper',
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

   return coins;
};
