import { CommonClientMessages, NpcClientMessages } from '@bananos/types';
import { Sprite } from '@inlet/react-pixi';
import _ from 'lodash';
import * as PIXI from 'pixi.js';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { BLOCK_SIZE } from '../../consts/consts';
import { setActiveTarget } from '../../stores';
import { SocketContext } from '../gameController/socketContext';
import { NpcQuestNotifier } from './NpcQuestNotifier';
import cursorSword from '../../assets/spritesheets/cursors/swordCursor.png';
import cursorSpeak from '../../assets/spritesheets/cursors/speakCursor.png';
import cursorLoot from '../../assets/spritesheets/cursors/lootCursor.png';
import defaultCursor from '../../assets/spritesheets/cursors/defaultCursor.png';
import { PlayerName } from '../player/PlayerName';
import { PlayerBars } from '../player/PlayerBars';

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
      const { currentHp } = playerPoints;
      const dispatch = useDispatch();

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
                  zIndex={1}
               />
            )}
            {currentHp <= 0 ? null : (
               <>
                  <PlayerName
                     h={h}
                     player={player}
                     charactersMovements={charactersMovements}
                  />
                  <PlayerBars
                     charactersMovements={charactersMovements}
                     player={player}
                     playerPoints={playerPoints}
                     h={h}
                  />
               </>
            )}
         </>
      ) : null;
   },
   (old, newProps) => _.isEqual(old.characterPowerPoints, newProps.characterPowerPoints) && _.isEqual(old.charactersMovements, newProps.charactersMovements)
);

export default Player;
