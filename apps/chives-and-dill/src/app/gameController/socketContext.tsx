import { EngineEvents } from '@bananos/types';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { initializePlayers, playerConnected } from '../../stores';
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
      context.socket.on(EngineEvents.Inicialization, ({ players }) => {
        dispatch(initializePlayers({ characters: players }));
      });

      context.socket.on('player_moved', ({ playerId, newLocation }) => {
        console.log(playerId, newLocation);
      });

      context.socket.on(EngineEvents.UserConnected, ({ player }) => {
        console.log('user_connected', player);
        dispatch(playerConnected({ characters: player }));
      });

      context.socket.on(EngineEvents.UserDisconnected, ({ userId }) => {
        console.log('user_disconnected', userId);
      });
    }
  }, [context]);

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
};

export default socketContext;
