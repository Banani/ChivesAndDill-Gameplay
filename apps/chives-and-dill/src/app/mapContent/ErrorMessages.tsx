import React, { useEffect, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { getEngineState } from '../../stores';
import { Text } from "@inlet/react-pixi";
import * as PIXI from 'pixi.js';
import { filter, map } from 'lodash';
import { selectCharacters, selectActiveCharacterId, getCharactersMovements } from "../../stores";

export const ErrorMessages = () => {
  const engineState = useSelector(getEngineState);
  const characters = useSelector(selectCharacters);
  const activePlayerId = useSelector(selectActiveCharacterId);
  const characterMovements = useSelector(getCharactersMovements);
  const [activeShapes, setActiveShapes] = useState([]);
  const activePlayer = characters[activePlayerId];
  const [messageLocation, setMessageLocation] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMessageLocation({
      x: characterMovements[activePlayerId].location.x - activePlayer.size,
      y: characterMovements[activePlayerId].location.y - activePlayer.size - window.innerHeight / 5,
    })
  }, [activePlayer, activePlayerId, characterMovements])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveShapes((prev) => filter(prev, (shape) => Date.now() - shape.creationTime < 2000));
    }, 20);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setActiveShapes((prev) => [...prev, ...map(engineState.errorMessages.events, (event) =>
    ({
      creationTime: Date.now(), event: {
        type: event.type,
        message: event.message,
      }
    })
    )]);
  }, [engineState.errorMessages.events]);

  useEffect(() => {
    if (activeShapes.length > 3) {
      setActiveShapes(activeShapes.shift());
    }
  }, [activeShapes])


  const getErrorMessages = useCallback(
    () =>
      map(activeShapes, ({ event }, i) => (
        <Text
          text={event.message}
          x={messageLocation.x}
          y={messageLocation.y}
          style={
            new PIXI.TextStyle({
              fontSize: 40,
              fill: '#8f0303',
              dropShadow: true,
              dropShadowColor: "#141414",
            })
          }
        />
      )),
    [engineState.characterPowerPoints]
  );

  return (
    <>
      {getErrorMessages()}
    </>
  )
}