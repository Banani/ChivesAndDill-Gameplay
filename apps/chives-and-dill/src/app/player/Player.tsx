import { CommonClientMessages, NpcClientMessages } from '@bananos/types';
import { Graphics, Sprite, Text } from '@inlet/react-pixi';
import _ from 'lodash';
import * as PIXI from 'pixi.js';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { BLOCK_SIZE } from '../../consts/consts';
import { setActiveTarget } from '../../stores';
import { SocketContext } from '../gameController/socketContext';
import { GetAbsorbsValue } from './GetPlayerAbsorbs';
import { NpcQuestNotifier } from './NpcQuestNotifier';
import cursorSword from '../../assets/spritesheets/cursors/swordCursor.png';
import cursorSpeak from '../../assets/spritesheets/cursors/speakCursor.png';
import cursorLoot from '../../assets/spritesheets/cursors/lootCursor.png';
import defaultCursor from '../../assets/spritesheets/cursors/defaultCursor.png';

const Player = React.memo<{ player: any, characterViewsSettings: any, charactersMovements: any, characterPowerPoints: any, keyBoardContext }>(
   ({ player, characterViewsSettings, charactersMovements, characterPowerPoints, keyBoardContext }) => {
      const [timer, setTimer] = useState(0);
      const [playerSheet, setPlayerSheet] = useState({});
      const [characterStatus, setCharacterStatus] = useState('standingDown');
      const [cursorImage, setCursorImage] = useState(`url(${defaultCursor}), auto`);

      const sheet = PIXI.BaseTexture.from(`../assets${characterViewsSettings[player.sprites].image}`);
      const playerSprite = characterViewsSettings[player.sprites];
      const w = playerSprite.spriteWidth;
      const h = playerSprite.spriteHeight;
      const playerPoints = characterPowerPoints[player.id] ?? { maxHp: 0, currentHp: 0 };
      const { maxHp, currentHp } = playerPoints;
      const dispatch = useDispatch();
      const playerAbsorb = GetAbsorbsValue(player.id);

      const context = useContext(SocketContext);
      const { socket } = context;

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
         if (!charactersMovements[player.id].isInMove) {
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
      }, [charactersMovements, currentHp, charactersMovements[player.id].isInMove, getDirection]);

      useEffect(() => {
         keyBoardContext.addKeyHandler({
            id: 'TargetManagerEscape',
            matchRegex: 'Escape',
            keydown: () => dispatch(setActiveTarget({ characterId: null })),
         });

         return () => keyBoardContext.removeKeyHandler('TargetManagerEscape');
      }, []);

      const drawAbsorbBar = (g) => {
         const barWidth = (playerAbsorb / (playerAbsorb + maxHp)) * 50;
         const healthBarWidth = (currentHp / (playerAbsorb + maxHp)) * 50 - 25;
         g.beginFill(0xe8e8e8);
         g.drawRect(charactersMovements[player.id].location.x + healthBarWidth, charactersMovements[player.id].location.y - h / 1.5, barWidth, 5);
         g.endFill();
      };

      const drawHealthBar = (g) => {
         const barWidth = (currentHp / (playerAbsorb + maxHp)) * 50;
         g.beginFill(0xff0000);
         g.drawRect(charactersMovements[player.id].location.x - 25, charactersMovements[player.id].location.y - h / 1.5, 50, 5);
         g.endFill();
         g.beginFill(0x00ff00);
         g.drawRect(charactersMovements[player.id].location.x - 25, charactersMovements[player.id].location.y - h / 1.5, barWidth, 5);
         g.endFill();
      };

      const handleNpcClick = () => {
         if (player.type !== 'Npc') {
            return;
         }

         socket?.emit(NpcClientMessages.OpenNpcConversationDialog, {
            npcId: player.id,
         });
      };

      const handleMonsterClick = () => {
         if (player.type !== 'Monster') {
            return;
         }
         socket?.emit(CommonClientMessages.OpenLoot, {
            corpseId: player.id,
         });
      };

      const handlePlayerClick = () => {
         dispatch(setActiveTarget({ characterId: player.id }));
         handleNpcClick();
         handleMonsterClick();
      };

      const hpBar = (g) => {
         g.clear();
         g.beginFill(0x000000);
         g.drawRect(charactersMovements[player.id].location.x - 26, charactersMovements[player.id].location.y - h / 1.5 - 1, 52, 7);
         g.endFill();
         drawHealthBar(g);
         drawAbsorbBar(g);
      };

      const handlePlayerHover = () => {
         if (player.type === 'Monster') {
            if (characterStatus === 'dead') {
               setCursorImage(`url(${cursorLoot}), auto`);
            } else {
               setCursorImage(`url(${cursorSword}), auto`);
            }
         } else if (player.type === 'Npc') {
            setCursorImage(`url(${cursorSpeak}), auto`);
         }
      };

      return charactersMovements[player.id] ? (
         <>
            <NpcQuestNotifier location={charactersMovements[player.id].location} player={player} />
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
                           lineJoin: 'round',
                           strokeThickness: 4,
                           fontFamily: 'Septimus',
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
                  pointerdown={() => handlePlayerClick()}
                  mouseover={() => handlePlayerHover()}
                  cursor={cursorImage}
               />
            )}
         </>
      ) : null;
   },
   (old, newProps) => _.isEqual(old.characterPowerPoints, newProps.characterPowerPoints) && _.isEqual(old.charactersMovements, newProps.charactersMovements)
);

export default Player;
