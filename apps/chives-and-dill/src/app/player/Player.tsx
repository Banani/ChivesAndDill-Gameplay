import React, { useState, useEffect, useCallback } from 'react';
import * as PIXI from 'pixi.js';
import { Graphics, Sprite, Text } from '@inlet/react-pixi';
import { useDispatch } from 'react-redux';
import { setActiveTarget } from '../../stores';
import { GetAbsorbsValue } from './GetPlayerAbsorbs';
import _ from 'lodash';
import { BLOCK_SIZE } from '../../consts/consts';

const Player = React.memo<{ player: any; characterViewsSettings: any; charactersMovements: any; characterPowerPoints: any }>(
   ({ player, characterViewsSettings, charactersMovements, characterPowerPoints }) => {

      const [timer, setTimer] = useState(0);
      const [playerSheet, setPlayerSheet] = useState({});
      const [characterStatus, setCharacterStatus] = useState('standingDown');
      const [isCharacterMoving, setIsCharacterMoving] = useState(false);

      const sheet = PIXI.BaseTexture.from(`../assets${characterViewsSettings[player.sprites].image}`);
      const playerSprite = characterViewsSettings[player.sprites];
      const w = playerSprite.spriteWidth;
      const h = playerSprite.spriteHeight;
      const playerPoints = characterPowerPoints[player.id] ?? { maxHp: 0, currentHp: 0 };
      const { maxHp, currentHp } = playerPoints;
      const dispatch = useDispatch();
      const playerAbsorb = GetAbsorbsValue(player.id);

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
         if (charactersMovements[player.id]) {
            getDirection(charactersMovements[player.id].direction);
         }
      }, [charactersMovements, currentHp, isCharacterMoving, getDirection]);

      useEffect(() => {
         if (charactersMovements[player.id]) {
            setIsCharacterMoving(charactersMovements[player.id].isInMove);
         }
      }, [charactersMovements, player.id]);

      const drawAbsorbBar = (g) => {
         const barWidth = (playerAbsorb / (playerAbsorb + maxHp)) * 50;
         const healthBarWidth = (currentHp / (playerAbsorb + maxHp)) * 50 - 25;
         g.beginFill(0xe8e8e8);
         g.drawRect(
            charactersMovements[player.id].location.x + healthBarWidth,
            charactersMovements[player.id].location.y - h / 1.5,
            barWidth,
            5
         );
         g.endFill();
      };

      const drawHealthBar = (g) => {
         const barWidth = (currentHp / (playerAbsorb + maxHp)) * 50;
         g.beginFill(0xff0000);
         g.drawRect(charactersMovements[player.id].location.x - 25, charactersMovements[player.id].location.y - h / 1.5, 50, 5);
         g.endFill();
         g.beginFill(0x00ff00);
         g.drawRect(
            charactersMovements[player.id].location.x - 25,
            charactersMovements[player.id].location.y - h / 1.5,
            barWidth,
            5
         );
         g.endFill();
      };

      const hpBar = useCallback(
         (g) => {
            g.clear();
            g.beginFill(0x000000);
            g.drawRect(
               charactersMovements[player.id].location.x - 26,
               charactersMovements[player.id].location.y - h / 1.5 - 1,
               52,
               7
            );
            g.endFill();
            drawHealthBar(g);
            drawAbsorbBar(g);
         },
         [charactersMovements, player, h]
      );

      return charactersMovements[player.id] ? (
         <>
            {currentHp <= 0 ? null : (
               <>
                  <Text
                     text={player.name}
                     anchor={[0.5, 1.3]}
                     x={charactersMovements[player.id].location.x}
                     y={charactersMovements[player.id].location.y - h / 1.5}
                     style={
                        new PIXI.TextStyle({
                           fontSize: 15,
                           fill: 'green',
                           fontWeight: 'bold',
                        })
                     }
                  />
                  <Graphics draw={hpBar} />
               </>
            )}
            {playerSheet['movementDown'] && (
               <Sprite
                  key={0}
                  width={BLOCK_SIZE}
                  interactive={true}
                  height={BLOCK_SIZE}
                  texture={playerSheet[characterStatus][timer % 8]}
                  x={charactersMovements[player.id].location.x - w / 2}
                  y={charactersMovements[player.id].location.y - h / 2}
                  pointerdown={() => dispatch(setActiveTarget({ characterId: player.id }))}
               />
            )}
         </>
      ) : null;
   },
   (old, newProps) =>
      _.isEqual(old.characterPowerPoints, newProps.characterPowerPoints) &&
      _.isEqual(old.charactersMovements, newProps.charactersMovements)
);

export default Player;
