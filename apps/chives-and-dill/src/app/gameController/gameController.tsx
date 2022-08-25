import { CommonClientMessages, GlobalStoreModule } from '@bananos/types';
import _ from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { KeyBoardContext } from '../../contexts/KeyBoardContext';
import { useEngineModuleReader } from '../../hooks';
import { SocketContext } from '../gameController/socketContext';
import { GameControllerContext } from './gameControllerContext';

const keyMovementMap = {
   w: { y: -1 },
   a: { x: -1 },
   s: { y: 1 },
   d: { x: 1 },
};

const GameController = ({ children }) => {
   const { activeCharacterId } = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER).data;
   const { data: characters } = useEngineModuleReader(GlobalStoreModule.CHARACTER);
   const { data: characterMovements } = useEngineModuleReader(GlobalStoreModule.CHARACTER_MOVEMENTS);
   const keyBoardContext = useContext(KeyBoardContext);

   const context = useContext(SocketContext);
   const { socket } = context;
   const [mousePosition, setMousePosition] = useState({ x: null, y: null });

   let gameWidth = window.innerWidth;
   let gameHeight = window.innerHeight;
   const ratio = 16 / 9;

   if (gameHeight < gameWidth / ratio) {
      gameWidth = gameHeight * ratio;
   } else {
      gameHeight = gameWidth / ratio;
   }

   useEffect(() => {
      keyBoardContext.addKeyHandler({
         id: 'gameControllerWASD',
         matchRegex: '[wasd]',
         keydown: (key) => socket?.emit(CommonClientMessages.PlayerStartMove, { source: key, ...keyMovementMap[key] }),
         keyup: (key) => socket?.emit(CommonClientMessages.PlayerStopMove, { source: key }),
      });

      return () => {
         keyBoardContext.removeKeyHandler('ConfirmationDialogEnter');
      };
   }, []);

   const keyPressHandler = (event) => {
      const key = event.key.toLowerCase();

      let keyBinds = _.map(characters[activeCharacterId].spells, (spell) => spell.name);
      keyBinds = keyBinds.reduce((prev, current, index) => {
         prev[index + 1] = current;
         return prev;
      }, {});

      if (keyBinds[key]) {
         socket?.emit(CommonClientMessages.PerformBasicAttack, {
            directionLocation: {
               x: characterMovements[activeCharacterId].location.x + mousePosition.x - gameWidth / 2,
               y: characterMovements[activeCharacterId].location.y + mousePosition.y - gameHeight / 2,
            },
            spellName: keyBinds[key],
         });
      }
   };

   const updateMousePosition = (e) => {
      setMousePosition({ x: e.offsetX, y: e.offsetY });
   };

   useEffect(() => {
      window.addEventListener('mousemove', updateMousePosition);

      return () => window.removeEventListener('mousemove', updateMousePosition);
   }, []);

   return (
      <GameControllerContext.Provider value={{}}>
         <div onKeyDown={(event) => keyPressHandler(event)} tabIndex={0}>
            {children}
         </div>
      </GameControllerContext.Provider>
   );
};

export default GameController;
