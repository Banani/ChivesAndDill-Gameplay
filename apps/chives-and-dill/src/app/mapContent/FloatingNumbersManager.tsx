import React, { useEffect, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { getEngineState } from '../../stores';
import { Text } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';
import { filter, map, forEach, chain } from 'lodash';
import { CharacterClientEvents, DamageAbsorbedEvent, EngineEventType, ExperienceGainEvent, HealthPointsSource } from '@bananos/types';

export const FloatingNumbersManager = () => {
   const engineState = useSelector(getEngineState);
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
         ...chain(engineState.characterPowerPoints.events)
            .filter((event) => event.type === EngineEventType.CharacterGotHp && event.source !== HealthPointsSource.Regeneration)
            .map((event) => ({ creationTime: Date.now(), y: 3.5, x: randomNumber(1.5, -1.5), event }))
            .value(),
      ]);
   }, [engineState.characterPowerPoints.events]);

   useEffect(() => {
      setActiveShapes((prev) => [
         ...prev,
         ...chain(engineState.absorbShields.events)
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
   }, [engineState.absorbShields.events]);

   useEffect(() => {
      setActiveShapes((prev) => [
         ...prev,
         ...chain(engineState.experience.events)
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
   }, [engineState.experience.events]);

   useEffect(() => {
      const interval = setInterval(() => {
         forEach(activeShapes, (event) => {
            event.y += 0.1;
         });
      }, 16);
      return () => clearInterval(interval);
   }, [engineState.characterPowerPoints.events]);

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
            const location = engineState.characterMovements.data[event.characterId].location;
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
      [engineState.characterPowerPoints]
   );

   return <>{getLostHp()}</>;
};
