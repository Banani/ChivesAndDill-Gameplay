import React, { useState, useEffect, useCallback } from 'react';
import * as PIXI from 'pixi.js';
import { Graphics, Sprite, Text } from '@inlet/react-pixi';
import _ from 'lodash';

const Player = ({ player, characterViewsSettings }) => {
   const [timer, setTimer] = useState(0);
   const [playerSheet, setPlayerSheet] = useState({});
   const [characterDirection, setCharacterDirection] = useState('standingDown');
   const [isCharacterMoving, setIsCharacterMoving] = useState(false);

   const playerSprite = characterViewsSettings[player.sprites];
   const sheet = PIXI.BaseTexture.from(`../assets${characterViewsSettings[player.sprites].image}`);
   const w = playerSprite.spriteWidth;
   const h = playerSprite.spriteHeight;

   const getPlayerSheets = () => {
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
   };

   const getDirection = (direction) => {
      if (!isCharacterMoving) {
         if (direction === 0) {
            setCharacterDirection('standingUp');
         }
         if (direction === 1) {
            setCharacterDirection('standingDown');
         }
         if (direction === 2) {
            setCharacterDirection('standingLeft');
         }
         if (direction === 3) {
            setCharacterDirection('standingRight');
         }
      } else {
         if (direction === 0) {
            setCharacterDirection('movementUp');
         }
         if (direction === 1) {
            setCharacterDirection('movementDown');
         }
         if (direction === 2) {
            setCharacterDirection('movementLeft');
         }
         if (direction === 3) {
            setCharacterDirection('movementRight');
         }
      }
   };

   useEffect(() => {
      setInterval(() => {
         setTimer((zxc) => zxc + 1);
      }, 20);
   }, []);

   useEffect(() => {
      getPlayerSheets();
   }, []);

   useEffect(() => {
      getDirection(player.direction);
   }, [player.direction, isCharacterMoving]);

   useEffect(() => {
      setIsCharacterMoving(player.isInMove);
   }, [player.isInMove]);

   useEffect(() => {
      if (player.currentHp <= 0) {
         setCharacterDirection('dead');
      }
   }, [player.currentHp]);

   const hpGreenBar = player.currentHp / 2;
   const hpBar = useCallback(
      (g) => {
         g.clear();
         g.beginFill(0xff0000);
         g.drawRect(player?.location.x - 25, player?.location.y - h / 1.5, player.maxHp / 2, 5);
         g.endFill();
         g.beginFill(0x00ff00);
         g.drawRect(player?.location.x - 25, player?.location.y - h / 1.5, hpGreenBar, 5);
         g.endFill();
      },
      [player, h]
   );

   return (
      <>
         {player.currentHp <= 0 ? null : (
            <>
               <Text
                  text={player.name}
                  anchor={[0.5, 3.25]}
                  x={player?.location.x}
                  y={player?.location.y}
                  style={
                     new PIXI.TextStyle({
                        fontSize: 15,
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
               texture={playerSheet[characterDirection][timer % 8]}
               x={player?.location.x - w / 2}
               y={player?.location.y - h / 2}
            />
         )}
      </>
   );
};

export default Player;
