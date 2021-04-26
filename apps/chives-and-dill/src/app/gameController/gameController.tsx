import { ClientMessages } from '@bananos/types';
import React, { useContext, useState } from 'react';
import AppContext from '../gameController/context';

const GameController = ({ children }) => {
  const context = useContext(AppContext);

  const { socket } = context;

  const [keyState, setKeyState] = useState<any>({});

  const keyPressHandler = (event) => {
    switch (event.key) {
      case 'a':
        {
          if (!keyState.a) {
            socket?.emit(ClientMessages.PlayerStartMove, {
              x: -1,
              source: 'key-a',
            });
            setKeyState({ ...keyState, a: true });
          }
        }
        break;
      case 'd':
        {
          if (!keyState.d) {
            socket?.emit(ClientMessages.PlayerStartMove, {
              x: 1,
              source: 'key-d',
            });
            setKeyState({ ...keyState, d: true });
          }
        }
        break;
      case 'w':
        {
          if (!keyState.w) {
            socket?.emit(ClientMessages.PlayerStartMove, {
              y: -1,
              source: 'key-w',
            });
            setKeyState({ ...keyState, w: true });
          }
        }
        break;
      case 's':
        {
          if (!keyState.s) {
            socket?.emit(ClientMessages.PlayerStartMove, {
              y: 1,
              source: 'key-s',
            });
            setKeyState({ ...keyState, s: true });
          }
        }
        break;
    }
  };

  const keyUpHandler = (event) => {
    switch (event.key) {
      case 'a':
        {
          setKeyState({ ...keyState, a: false });
          socket?.emit(ClientMessages.PlayerStopMove, { source: 'key-a' });
        }
        break;
      case 'd':
        {
          setKeyState({ ...keyState, d: false });
          socket?.emit(ClientMessages.PlayerStopMove, { source: 'key-d' });
        }
        break;
      case 'w':
        {
          setKeyState({ ...keyState, w: false });
          socket?.emit(ClientMessages.PlayerStopMove, { source: 'key-w' });
        }
        break;
      case 's':
        {
          setKeyState({ ...keyState, s: false });
          socket?.emit(ClientMessages.PlayerStopMove, { source: 'key-s' });
        }
        break;
    }
  };

  const clickHandler = (event) => {
    socket?.emit(ClientMessages.PerformBasicAttack, {
      directionLocation: {
        x: event.pageX,
        y: event.pageY,
      },
      spellName: 'Potato-Inator',
    });
  };

  return (
    <div
      onKeyDown={(event) => keyPressHandler(event)}
      onKeyUp={keyUpHandler}
      onClick={(event) => clickHandler(event)}
      tabIndex={0}
    >
      {children}
    </div>
  );
};

export default GameController;
