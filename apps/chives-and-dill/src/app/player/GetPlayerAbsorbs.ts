import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useEnginePackageProvider } from '../../hooks';

export const GetAbsorbsValue = (playerId) => {
   const { absorbShields } = useEnginePackageProvider();

   const [activeShields, setActiveShields] = useState(0);
   const [absorbSpells, setAbsorbSpells] = useState([]);

   useEffect(() => {
      const playerAbsorbSpells = _.filter(absorbShields, function (value, key) {
         return value.ownerId === playerId;
      });
      setAbsorbSpells(new Array(...playerAbsorbSpells));
   }, [absorbShields, playerId]);

   useEffect(() => {
      if (absorbSpells.length) {
         absorbSpells.forEach((key) => {
            setActiveShields(key.value);
         });
      } else {
         setActiveShields(0);
      }
   }, [absorbSpells]);

   return activeShields;
};
