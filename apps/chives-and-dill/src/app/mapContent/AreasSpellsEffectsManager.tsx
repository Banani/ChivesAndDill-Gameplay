import { GlobalStoreModule } from '@bananos/types';
import { Graphics } from '@inlet/react-pixi';
import _ from 'lodash';
import React, { useCallback } from 'react';
import { useEngineModuleReader } from '../../hooks';

export const AreasSpellsEffectsManager = () => {
   const { data: areaTimeEffects } = useEngineModuleReader(GlobalStoreModule.SPELLS);

   const drawAreasSpellsEffects = useCallback(
      (g) => {
         g.clear();
         _.map(areaTimeEffects, (areaSpellEffect: any, index) => {
            g.beginFill(0x333333);
            g.drawCircle(areaSpellEffect.location.x, areaSpellEffect.location.y, areaSpellEffect.radius);
            g.endFill();
         });
      },
      [areaTimeEffects]
   );

   return <Graphics draw={drawAreasSpellsEffects} />;
};
