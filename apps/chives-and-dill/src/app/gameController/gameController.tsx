import React, { useContext } from 'react';
import AppContext from "../gameController/context";

const GameController = ({ children }) => {

  const context = useContext(AppContext);

  const { socket } = context;

  const keyDownHandler = (event) => {
    const key = event.key;
    switch (event.key) {
      case "a":
        socket?.emit('move_left(x--, y, source: "key-a")');
        break;
      case "d":
        socket?.emit('move_right(x++, y, source: "key-d")');
        break;
      case "w":
        socket?.emit('move_up(x, y--, source: "key-w")');
        break;
      case "s":
        socket?.emit('move_down(x, y++, source: "key-s")');
        break;
    }
  }

  return (
    <div onKeyDown={(event) => keyDownHandler(event)} tabIndex={0}>
      {children}
    </div>
  )
}

export default GameController;