import { EngineMessages, QuestEngineMessages } from '@bananos/types';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import {
  initialize,
  addPlayer,
  changePlayerPosition,
  deletePlayer,
  changePlayerMovingStatus,
  addSpell,
  updateSpell,
  deleteProjectile,
  updateCharacterHp,
  characterDied,
  questStarted,
  questCompleted,
  killingStagePartProgress,
  newQuestStageStarted
} from '../../stores';
import AppContext from './context';

const SocketContext = ({ children }) => {
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
         context.socket.on(EngineMessages.Inicialization, ({ players, areas, activePlayer, projectiles }) => {
            dispatch(initialize({ characters: players, areas, activePlayer, projectiles }));
         });

         context.socket.on(EngineMessages.PlayerMoved, ({ playerId, newLocation, newDirection }) => {
            dispatch(
               changePlayerPosition({
                  selectedPlayerId: playerId,
                  newLocation,
                  newDirection,
               })
            );
         });

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

         context.socket.on(EngineMessages.CharacterLostHp, ({characterId, currentHp, amount}) => {
         dispatch(updateCharacterHp({ characterId, currentHp, amount }));
         });

         context.socket.on(EngineMessages.CharacterDied, ({characterId}) => {
         dispatch(characterDied({ characterId }));
         });

         context.socket.on(EngineMessages.ProjectileRemoved, ({ projectileId }) => {
            dispatch(deleteProjectile({ projectileId }));
         });

         context.socket.on(QuestEngineMessages.QuestStarted, ({ questTemplate, characterId }) => {
            dispatch(questStarted({ questTemplate, characterId }));
         });

         context.socket.on(QuestEngineMessages.QuestCompleted, ({ questId, characterId }) => {
            dispatch(questCompleted({ questId, characterId }));
         });

         context.socket.on(QuestEngineMessages.NewQuestStageStarted, ({ questId, characterId, questStage }) => {
            dispatch(newQuestStageStarted({ questId, characterId, questStage }));
         });
         
         context.socket.on(QuestEngineMessages.KillingStagePartProgress, ({ questId, stageId, characterId, stagePartId, currentProgress, targetAmount }) => {
            dispatch(killingStagePartProgress({ questId, stageId, characterId, stagePartId, currentProgress, targetAmount }));
         });

    }
  }, [context]);

   return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
};

export default SocketContext;
