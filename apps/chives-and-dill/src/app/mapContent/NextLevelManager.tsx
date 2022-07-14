import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Text } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';
import { selectActiveCharacterId, selectCharacters, getCharactersMovements, getEngineState } from '../../stores';
import { EngineEventType } from '@bananos/types';

export const NextLevelManager = () => {
   const engineState = useSelector(getEngineState);
   const [characterLevel, setCharacterLevel] = useState(0);
   const [messageLocation, setMessageLocation] = useState({ x: 0, y: 0 });
   const characters = useSelector(selectCharacters);
   const activePlayerId = useSelector(selectActiveCharacterId);
   const characterMovements = useSelector(getCharactersMovements);
   const activePlayer = characters[activePlayerId];

   useEffect(() => {
      setMessageLocation({
         x: characterMovements[activePlayerId].location.x - activePlayer.size,
         y: characterMovements[activePlayerId].location.y - activePlayer.size - window.innerHeight / 6,
      });
   }, [activePlayer, activePlayerId, characterMovements]);

   useEffect(() => {
      engineState.experience.events.forEach((event) => {
         if (event.type === EngineEventType.LevelChanged) {
            if (event.level > characterLevel) {
               setCharacterLevel(event.level);
            }
         }
      });
   }, [engineState.experience.events, characterLevel]);

   useEffect(() => {
      setTimeout(() => {
         setCharacterLevel(0);
      }, 3000);
   }, [characterLevel]);

   return characterLevel ? (
      <>
         <Text
            text={"You've Reached"}
            x={messageLocation.x - 40}
            y={messageLocation.y - 50}
            style={
               new PIXI.TextStyle({
                  fontSize: 30,
                  fill: '#e8e8e8',
                  stroke: '#000000',
                  strokeThickness: 2,
               })
            }
         />

         <Text
            text={`Level ${characterLevel}`}
            x={messageLocation.x}
            y={messageLocation.y}
            style={
               new PIXI.TextStyle({
                  fontSize: 40,
                  fill: '#fac20a',
                  stroke: '#000000',
                  strokeThickness: 3,
               })
            }
         />
      </>
   ) : null;
};
