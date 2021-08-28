import React, { useEffect, useCallback, useState } from "react";
import { Sprite } from '@inlet/react-pixi';
import { useSelector } from 'react-redux';
import { getEngineState } from '../../stores';
import { filter, map } from 'lodash';

export const BloodPoolManager = () => {
  const engineState = useSelector(getEngineState);
  const events = engineState.characterPowerPoints.events;
  const [activeShapes, setActiveShapes] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveShapes((prev) => filter(prev, (shape) => Date.now() - shape.creationTime < 200));
    }, 20);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setActiveShapes((prev) => [...prev, ...map(filter(events, event => event.type === 'CharacterLostHp'), (event) =>
      ({ creationTime: Date.now(), event })
    )]);
  }, [events]);

  const getLostHp = useCallback(
    () =>
      map(activeShapes, ({ event }, i) => {
        const location = engineState.characterMovements.data[event.characterId].location;
        return (
          <Sprite anchor={[0.3, 0.3]} image="../assets/spritesheets/player/bloodPool.png" x={location.x} y={location.y}></Sprite>
        )
      }),
    [engineState.characterPowerPoints]
  );

  return (
    <>{getLostHp()}</>
  )
}