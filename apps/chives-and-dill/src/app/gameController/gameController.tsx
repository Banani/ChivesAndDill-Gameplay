import { ClientMessages } from '@bananos/types';
import React, { useContext, useState } from 'react';
import AppContext from '../gameController/context';
import { useSelector } from 'react-redux';
import { selectCharacters, selectActivePlayer } from '../../stores';

const GameController = ({ children }) => {
   const context = useContext(AppContext);
   const { socket } = context;
   const [keyState, setKeyState] = useState<Record<string, boolean>>({});

   const activePlayerId = useSelector(selectActivePlayer);
   const players = useSelector(selectCharacters);

   const keyPressHandler = (event) => {
      switch (event.key) {
         case 'a':
            if (!keyState.a) {
               socket?.emit(ClientMessages.PlayerStartMove, {
                  x: -1,
                  source: 'key-a',
               });
               setKeyState({ ...keyState, a: true });
            }
            break;
         case 'd':
            if (!keyState.d) {
               socket?.emit(ClientMessages.PlayerStartMove, {
                  x: 1,
                  source: 'key-d',
               });
               setKeyState({ ...keyState, d: true });
            }
            break;
         case 'w':
            if (!keyState.w) {
               socket?.emit(ClientMessages.PlayerStartMove, {
                  y: -1,
                  source: 'key-w',
               });
               setKeyState({ ...keyState, w: true });
            }
            break;
         case 's':
            if (!keyState.s) {
               socket?.emit(ClientMessages.PlayerStartMove, {
                  y: 1,
                  source: 'key-s',
               });
               setKeyState({ ...keyState, s: true });
            }
            break;
      }
   };

   const keyUpHandler = (event) => {
      switch (event.key) {
         case 'a':
            setKeyState({ ...keyState, a: false });
            socket?.emit(ClientMessages.PlayerStopMove, { source: 'key-a' });
            break;
         case 'd':
            setKeyState({ ...keyState, d: false });
            socket?.emit(ClientMessages.PlayerStopMove, { source: 'key-d' });
            break;
         case 'w':
            setKeyState({ ...keyState, w: false });
            socket?.emit(ClientMessages.PlayerStopMove, { source: 'key-w' });
            break;
         case 's':
            setKeyState({ ...keyState, s: false });
            socket?.emit(ClientMessages.PlayerStopMove, { source: 'key-s' });
            break;
      }
   };

   const clickHandler = (event) => {
      let gameWidth = window.innerWidth;
      let gameHeight = window.innerHeight;
      const ratio = 16 / 9;

      if (gameHeight < gameWidth / ratio) {
         gameWidth = gameHeight * ratio;
      } else {
         gameHeight = gameWidth / ratio;
      }
      socket?.emit(ClientMessages.PerformBasicAttack, {
         directionLocation: {
            x: players[activePlayerId]?.location.x + event.nativeEvent.offsetX - gameWidth / 2,
            y: players[activePlayerId]?.location.y + event.nativeEvent.offsetY - gameHeight / 2,
         },
         spellName: 'test',
      });
   };

   return (
      <div onKeyDown={(event) => keyPressHandler(event)} onKeyUp={keyUpHandler} onClick={(event) => clickHandler(event)} tabIndex={0}>
         {children}
      </div>
   );
};

export default GameController;
