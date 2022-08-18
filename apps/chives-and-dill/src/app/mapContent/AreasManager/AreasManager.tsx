import { useEnginePackageProvider } from 'apps/chives-and-dill/src/hooks';
import { map } from 'lodash';
import React from 'react';
import { Border } from './Border';
import { Obstacle } from './Obstacle';

export const AreasManager = () => {
   const { areas } = useEnginePackageProvider();

   return (
      <>
         {map(areas, (area) => (
            <Obstacle coords={area} />
         ))}
         <Border />
      </>
   );
};
