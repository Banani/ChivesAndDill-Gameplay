import React from 'react';
import { useSelector } from 'react-redux';
import { selectAreas } from '../../../stores';
import { Obstacle } from './Obstacle';
import { Border } from './Border';

export const AreasManager = () => {
   const areas = useSelector(selectAreas);

   return (
      <>
         {areas.map((area) => (
            <Obstacle coords={area} />
         ))}
         <Border />
      </>
   );
};
