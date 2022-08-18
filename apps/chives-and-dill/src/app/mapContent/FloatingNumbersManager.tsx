import { CharacterClientEvents, DamageAbsorbedEvent, EngineEventType, ExperienceGainEvent, HealthPointsSource } from '@bananos/types';
import { Text } from '@inlet/react-pixi';
import { chain, filter, forEach, map } from 'lodash';
import * as PIXI from 'pixi.js';
import React, { useCallback, useEffect, useState } from 'react';
import { useEnginePackageProvider } from '../../hooks';

export const FloatingNumbersManager = () => {
   const { characterPowerPointsEvents, absorbShieldEvents, experienceEvents, characterPowerPoints, characterMovements } = useEnginePackageProvider();
   const [activeShapes, setActiveShapes] = useState([]);

   useEffect(() => {
      const interval = setInterval(() => {
         setActiveShapes((prev) => filter(prev, (shape) => Date.now() - shape.creationTime < 400));
      }, 20);

      return () => clearInterval(interval);
   }, []);

   useEffect(() => {
      setActiveShapes((prev) => [
         ...prev,
         ...chain(characterPowerPointsEvents)
            .filter((event) => event.type === EngineEventType.CharacterGotHp && event.source !== HealthPointsSource.Regeneration)
            .map((event) => ({ creationTime: Date.now(), y: 3.5, x: randomNumber(1.5, -1.5), event }))
            .value(),
      ]);
   }, [characterPowerPointsEvents]);

   useEffect(() => {
      setActiveShapes((prev) => [
         ...prev,
         ...chain(absorbShieldEvents)
            .filter((event) => event.type === EngineEventType.DamageAbsorbed)
            .map((event: DamageAbsorbedEvent) => ({
               creationTime: Date.now(),
               y: 3.5,
               x: randomNumber(1.5, -1.5),
               event: {
                  type: event.type,
                  characterId: event.characterId,
                  amount: 'absorb',
               },
            }))
            .value(),
      ]);
   }, [absorbShieldEvents]);

   useEffect(() => {
      setActiveShapes((prev) => [
         ...prev,
         ...chain(experienceEvents)
            .filter((event) => event.type === CharacterClientEvents.ExperienceGain)
            .map((event: ExperienceGainEvent) => {
               return {
                  creationTime: Date.now(),
                  y: 3.5,
                  x: randomNumber(1.5, -1.5),
                  event: {
                     type: event.type,
                     characterId: event.characterId,
                     amount: `XP: ${event.amount}`,
                  },
               };
            })
            .value(),
      ]);
   }, [experienceEvents]);

   useEffect(() => {
      const interval = setInterval(() => {
         forEach(activeShapes, (event) => {
            event.y += 0.1;
         });
      }, 16);
      return () => clearInterval(interval);
   }, [characterPowerPointsEvents]);

   const getColorOfEvent = (type) => {
      switch (type) {
         case 'CharacterGotHp':
            return 'green';
         case 'CharacterLostHp':
            return 'red';
         case 'DamageAbsorbed':
            return 'silver';
         case CharacterClientEvents.ExperienceGain:
            return 'purple';
      }
   };

   const randomNumber = (n, b) => Math.random() * (b - n) + n;

   const getLostHp = useCallback(
      () =>
         map(activeShapes, ({ event, y, x }, i) => {
            const location = characterMovements[event.characterId].location;
            return (
               <Text
                  text={event.amount}
                  anchor={[x, y]}
                  x={location.x}
                  y={location.y}
                  style={
                     new PIXI.TextStyle({
                        fontSize: 20,
                        fill: getColorOfEvent(event.type),
                     })
                  }
               />
            );
         }),
      [characterPowerPoints]
   );

   return <>{getLostHp()}</>;
};
