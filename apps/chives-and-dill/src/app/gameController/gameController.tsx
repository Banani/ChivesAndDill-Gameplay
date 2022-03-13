import { CommonClientMessages } from '@bananos/types';
import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../gameController/socketContext';
import { GameControllerContext } from './gameControllerContext';
import { useSelector } from 'react-redux';
import { selectActiveCharacterId, selectCharacters, getEngineState } from '../../stores';
import _ from 'lodash';

const GameController = ({ children }) => {
   const context = useContext(SocketContext);
   const [gameControllerContext, setGameControllerContext] = useState<any>({});
   const { socket } = context;
   const [keysState, setKeysState] = useState<Record<string, boolean>>({});
   const [mousePosition, setMousePosition] = useState({ x: null, y: null });

   const characters = useSelector(selectCharacters);
   const activePlayerId = useSelector(selectActiveCharacterId);
   const engineState = useSelector(getEngineState);

   let gameWidth = window.innerWidth;
   let gameHeight = window.innerHeight;
   const ratio = 16 / 9;

   if (gameHeight < gameWidth / ratio) {
      gameWidth = gameHeight * ratio;
   } else {
      gameHeight = gameWidth / ratio;
   }

   useEffect(() => {
      setGameControllerContext(keysState);
   }, [keysState]);

   const keyPressHandler = (event) => {
      switch (event.key) {
         case 'a':
            if (!keysState.a) {
               socket?.emit(CommonClientMessages.PlayerStartMove, {
                  x: -1,
                  source: 'key-a',
               });
               setKeysState({ ...keysState, a: true });
            }
            break;
         case 'd':
            if (!keysState.d) {
               socket?.emit(CommonClientMessages.PlayerStartMove, {
                  x: 1,
                  source: 'key-d',
               });
               setKeysState({ ...keysState, d: true });
            }
            break;
         case 'w':
            if (!keysState.w) {
               socket?.emit(CommonClientMessages.PlayerStartMove, {
                  y: -1,
                  source: 'key-w',
               });
               setKeysState({ ...keysState, w: true });
            }
            break;
         case 's':
            if (!keysState.s) {
               socket?.emit(CommonClientMessages.PlayerStartMove, {
                  y: 1,
                  source: 'key-s',
               });
               setKeysState({ ...keysState, s: true });
            }
            break;
      }

      const key = event.key.toLowerCase();

      let keyBinds = _.map(characters[activePlayerId].spells, (spell) => spell.name);
      keyBinds = keyBinds.reduce((prev, current, index) => {
         prev[index + 1] = current;
         return prev;
      }, {});

      if (keyBinds[key]) {
         socket?.emit(CommonClientMessages.PerformBasicAttack, {
            directionLocation: {
               x: engineState.characterMovements.data[activePlayerId].location.x + mousePosition.x - gameWidth / 2,
               y: engineState.characterMovements.data[activePlayerId].location.y + mousePosition.y - gameHeight / 2,
            },
            spellName: keyBinds[key],
         });
         setKeysState({ ...keysState, [key]: true });
      }
   };

   const keyUpHandler = (event) => {
      switch (event.key) {
         case 'a':
            setKeysState({ ...keysState, a: false });
            socket?.emit(CommonClientMessages.PlayerStopMove, { source: 'key-a' });
            break;
         case 'd':
            setKeysState({ ...keysState, d: false });
            socket?.emit(CommonClientMessages.PlayerStopMove, { source: 'key-d' });
            break;
         case 'w':
            setKeysState({ ...keysState, w: false });
            socket?.emit(CommonClientMessages.PlayerStopMove, { source: 'key-w' });
            break;
         case 's':
            setKeysState({ ...keysState, s: false });
            socket?.emit(CommonClientMessages.PlayerStopMove, { source: 'key-s' });
            break;
         case '1':
            setKeysState({ ...keysState, 1: false });
            break;
         case '2':
            setKeysState({ ...keysState, 2: false });
            break;
         case '3':
            setKeysState({ ...keysState, 3: false });
            break;
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
      <GameControllerContext.Provider value={gameControllerContext}>
         <div onKeyDown={(event) => keyPressHandler(event)} onKeyUp={keyUpHandler} tabIndex={0}>
            {children}
         </div>
      </GameControllerContext.Provider>
   );
};

export default GameController;
