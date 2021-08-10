import React, { useState, useEffect, useCallback } from 'react';
import * as PIXI from 'pixi.js';
import { Graphics, Sprite, Text } from '@inlet/react-pixi';
import { useSelector } from 'react-redux';
import { getEngineState } from "../../stores";
import _ from 'lodash';

const Player = ({ player, characterViewsSettings }) => {
   const [timer, setTimer] = useState(0);
   const [playerSheet, setPlayerSheet] = useState({});
   const [characterStatus, setCharacterStatus] = useState('standingDown');
   const [isCharacterMoving, setIsCharacterMoving] = useState(false);
   const [yPositionOfUpdatedHp, setYPositionOfUpdatedHp] = useState(2.5);
   const sheet = PIXI.BaseTexture.from(`../assets${characterViewsSettings[player.sprites].image}`);
   const playerSprite = characterViewsSettings[player.sprites];
   const w = playerSprite.spriteWidth;
   const h = playerSprite.spriteHeight;
   const engineState = useSelector(getEngineState);
   const playerPoints = engineState.characterPowerPoints[player.id] ?? { maxHp: 0, currentHp: 0 };
   const { maxHp, currentHp } = playerPoints;

   const getPlayerSheets = useCallback(() => {
      const newPlayerSheets = {
         movementDown: [],
         movementUp: [],
         movementRight: [],
         movementLeft: [],
         standingUp: [],
         standingDown: [],
         standingRight: [],
         standingLeft: [],
         dead: [],
      };

      _.forOwn(newPlayerSheets, function (value, key) {
         for (let i = 0; i < playerSprite[key].spriteAmount; i++) {
            newPlayerSheets[key][i] = new PIXI.Texture(sheet, new PIXI.Rectangle(i * w + playerSprite[key].xOffSet, playerSprite[key].yOffSet, w, h));
         }
      });
      setPlayerSheet(newPlayerSheets);
   }, [sheet, w, h, playerSprite]);

   const getDirection = (direction) => {
      if (!isCharacterMoving) {
         if (direction === 0) {
            setCharacterStatus('standingUp');
         }
         if (direction === 1) {
            setCharacterStatus('standingDown');
         }
         if (direction === 2) {
            setCharacterStatus('standingLeft');
         }
         if (direction === 3) {
            setCharacterStatus('standingRight');
         }
      } else {
         if (direction === 0) {
            setCharacterStatus('movementUp');
         }
         if (direction === 1) {
            setCharacterStatus('movementDown');
         }
         if (direction === 2) {
            setCharacterStatus('movementLeft');
         }
         if (direction === 3) {
            setCharacterStatus('movementRight');
         }
      }
   };

   useEffect(() => {
      setInterval(() => {
         setTimer((i) => i + 1);
      }, 50);
   }, []);

   useEffect(() => {
      getPlayerSheets();
   }, []);

   useEffect(() => {
      if (currentHp <= 0) {
         setCharacterStatus('dead');
         return;
      }
      if (engineState.characterMovements[player.id]) {
         getDirection(engineState.characterMovements[player.id].direction);
      }
   }, [engineState.characterMovements, currentHp, isCharacterMoving]);

   useEffect(() => {
      if (engineState.characterMovements[player.id]) {
         setIsCharacterMoving(engineState.characterMovements[player.id].isInMove);
      }

   }, [engineState.characterMovements, player.id]);

   useEffect(() => {
      let position = 2.5;
      const positionTimer = setInterval(() => {
         position += 0.1;
         setYPositionOfUpdatedHp(position);
         if (position >= 4.5) {
            clearInterval(positionTimer);
         }
      }, 20)

      if (currentHp <= 0) {
         setCharacterStatus('dead');
      }
   }, [currentHp]);

   const drawAbsorbBar = (g) => {
      let barWidth;
      if ((player.absorb / maxHp) * 50 > 50) {
         barWidth = 50;
      } else {
         barWidth = (player.absorb / maxHp) * 50;
      }
      g.beginFill(0xe8e8e8);
      g.drawRect(engineState?.characterMovements[player.id].location.x - 25, engineState?.characterMovements[player.id].location.y - h / 1.5, barWidth, 5);
      g.endFill();
   }

   const drawHealthBar = (g) => {
      g.beginFill(0xff0000);
      g.drawRect(engineState?.characterMovements[player.id].location.x - 25, engineState?.characterMovements[player.id].location.y - h / 1.5, 50, 5);
      g.endFill();
      g.beginFill(0x00ff00);
      g.drawRect(engineState?.characterMovements[player.id].location.x - 25, engineState?.characterMovements[player.id].location.y - h / 1.5, (currentHp / maxHp) * 50, 5);
      g.endFill();
   }

   const hpBar = useCallback(
      (g) => {
         g.clear();
         g.beginFill(0x000000);
         g.drawRect(engineState?.characterMovements[player.id].location.x - 26, (engineState?.characterMovements[player.id].location.y - h / 1.5 - 1), 52, 7);
         g.endFill();
         drawHealthBar(g);
         drawAbsorbBar(g);
      },
      [engineState.characterMovements, player, h]
   );

   const returnColorOfHpNumber = () => {
      if (player.spellEffect === "heal") {
         return "green";
      }
      return "red"
   }

   return (
      engineState.characterMovements[player.id] ?
         <>
            {currentHp <= 0 ? null : (
               <>
                  <Text
                     text={player.name}
                     anchor={[0.5, 1.3]}
                     x={engineState.characterMovements[player.id].location.x}
                     y={engineState.characterMovements[player.id].location.y - h / 1.5}
                     style={
                        new PIXI.TextStyle({
                           fontSize: 15,
                           fill: "green",
                           fontWeight: "bold"
                        })
                     }
                  />
                  <Graphics draw={hpBar} />
               </>
            )}
            {playerSheet['movementDown'] && (
               <Sprite
                  key={0}
                  width={w}
                  height={h}
                  texture={playerSheet[characterStatus][timer % 8]}
                  x={engineState.characterMovements[player.id].location.x - w / 2}
                  y={engineState.characterMovements[player.id].location.y - h / 2}
               />
            )}
            {
               yPositionOfUpdatedHp <= 4.5 ? <Text
                  text={player.hpLost ? player.hpLost : null}
                  anchor={[0.5, yPositionOfUpdatedHp]}
                  x={engineState.characterMovements[player.id].location.x}
                  y={engineState.characterMovements[player.id].location.y}
                  style={
                     new PIXI.TextStyle({
                        fontSize: 15,
                        fill: returnColorOfHpNumber(),
                     })
                  }
               /> : null
            }
         </> : null
   );
};

export default Player;
