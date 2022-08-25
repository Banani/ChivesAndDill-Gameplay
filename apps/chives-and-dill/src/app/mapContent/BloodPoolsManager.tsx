import { GlobalStoreModule } from '@bananos/types';
import { Sprite } from '@inlet/react-pixi';
import { filter, map } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useEngineModuleReader } from '../../hooks';

export const BloodPoolManager = () => {
   const { events: characterPowerPointsEvents } = useEngineModuleReader(GlobalStoreModule.CHARACTER_POWER_POINTS);
   const { data: characterPowerPoints } = useEngineModuleReader(GlobalStoreModule.CHARACTER_POWER_POINTS);
   const { data: characterMovements } = useEngineModuleReader(GlobalStoreModule.CHARACTER_MOVEMENTS);
   const [activeShapes, setActiveShapes] = useState([]);

   useEffect(() => {
      const interval = setInterval(() => {
         setActiveShapes((prev) => filter(prev, (shape) => Date.now() - shape.creationTime < 200));
      }, 20);

      return () => clearInterval(interval);
   }, []);

   useEffect(() => {
      setActiveShapes((prev) => [
         ...prev,
         ...map(
            filter(characterPowerPointsEvents, (event) => event.type === 'CharacterLostHp'),
            (event) => ({ creationTime: Date.now(), event })
         ),
      ]);
   }, [characterPowerPointsEvents]);

   const getLostHp = useCallback(
      () =>
         map(activeShapes, ({ event }, i) => {
            const location = characterMovements[event.characterId].location;
            return <Sprite anchor={[0.3, 0.3]} image="../assets/spritesheets/player/bloodPool.png" x={location.x} y={location.y}></Sprite>;
         }),
      [characterPowerPoints]
   );

   return <>{getLostHp()}</>;
};
