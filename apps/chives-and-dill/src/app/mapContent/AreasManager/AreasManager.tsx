import { GlobalStoreModule } from '@bananos/types';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import { map } from 'lodash';
import React from 'react';
import { Border } from './Border';
import { Obstacle } from './Obstacle';

export const AreasManager = () => {
   const { data: areas } = useEngineModuleReader(GlobalStoreModule.AREAS);

   return (
      <>
         {map(areas.area, (area) => (
            <Obstacle coords={area} />
         ))}
         <Border />
      </>
   );
};
