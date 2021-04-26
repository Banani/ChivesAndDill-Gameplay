import { EngineMessages } from '@bananos/types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import {
  initialize,
  addPlayer,
  changePlayerPosition,
  deletePlayer,
  changePlayerMovingStatus,
  addSpell,
  updateSpell
} from '../../stores';
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
      context.socket.on(
        EngineMessages.Inicialization,
        ({ players, areas, activePlayer, projectiles }) => {
          dispatch(initialize({ characters: players, areas, activePlayer, projectiles }));
        }
      );

      context.socket.on(
        EngineMessages.PlayerMoved,
        ({ playerId, newLocation, newDirection }) => {
          dispatch(
            changePlayerPosition({
              selectedPlayerId: playerId,
              newLocation,
              newDirection,
            })
          );
        }
      );

      context.socket.on(EngineMessages.PlayerStartedMovement, ({ userId }) => {
        dispatch(changePlayerMovingStatus({ userId, isInMove: true }));
      });

      context.socket.on(EngineMessages.PlayerStoppedMovement, ({ userId }) => {
        dispatch(changePlayerMovingStatus({ userId, isInMove: false }));
      });

      context.socket.on(EngineMessages.UserConnected, ({ player }) => {
        dispatch(addPlayer({ player }));
      });

      context.socket.on(EngineMessages.UserDisconnected, ({ userId }) => {
        dispatch(deletePlayer({ userId }));
      });

      context.socket.on(EngineMessages.ProjectileCreated, ({ projectileId, spell, currentLocation }) => {
        dispatch(addSpell({ projectileId, spell, currentLocation }));
      });

      context.socket.on(EngineMessages.ProjectileMoved, ({ angle, newLocation, projectileId }) => {
        dispatch(updateSpell({ projectileId, angle, newLocation }));
      });
    }
  }, [context]);

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
};

export default socketContext;
