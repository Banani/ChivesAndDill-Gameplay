import { EngineMessages } from '@bananos/types';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { initializePlayers, addPlayer, changePlayerPosition, deletePlayer } from '../../stores';
import AppContext from './context';

const socketContext = ({ children }) => {
  const [context, setContext] = useState<any>({});
  const dispatch = useDispatch();

  useEffect(() => {
    const URL = 'http://localhost:3000';
    setContext({
      ...context,
      socket: io(URL, { autoConnect: true }),
    });
  }, []);

  useEffect(() => {
    if (context.socket) {
      context.socket.on(EngineMessages.Inicialization, ({ players }) => {
        dispatch(initializePlayers({ characters: players }));
      });

      context.socket.on(EngineMessages.PlayerMoved, ({ playerId, newLocation }) => {
        dispatch(changePlayerPosition({ selectedPlayerId: playerId, newLocation }));
      });

      context.socket.on(EngineMessages.UserConnected, ({ player }) => {
        dispatch(addPlayer({ player }));
      });

      context.socket.on(EngineMessages.UserDisconnected, ({ userId }) => {
        dispatch(deletePlayer({ userId }));
      });
    }
  }, [context]);

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
};

export default socketContext;
