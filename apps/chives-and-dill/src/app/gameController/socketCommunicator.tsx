import { EngineMessages, FightingEngineMessages, QuestEngineMessages } from '@bananos/types';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import {
   initializePlayers,
   initializeSpells,
   addPlayer,
   changePlayerPosition,
   deletePlayer,
   changePlayerMovingStatus,
   addProjectile,
   updateProjectile,
   deleteProjectile,
   updateCharacterHp,
   characterDied,
   updateCharacterSpellPower,
   areaSpellEffectCreated,
   areaSpellEffectRemoved,
   addActiveSpellCast,
   deleteActiveSpellCast,
} from '../../stores';
import { SocketContext } from './socketContext';

const SocketCommunicator = ({ children }) => {
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
         context.socket.on(EngineMessages.Inicialization, ({ players, areas, activePlayer, projectiles, spells }) => {
            dispatch(initializePlayers({ characters: players, areas, activePlayer }));
            dispatch(initializeSpells({ projectiles, spells }));
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

         context.socket.on(QuestEngineMessages.KillingStagePartProgress, (data) => {
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
            dispatch(addProjectile({ projectileId, spell, currentLocation }));
         });

         context.socket.on(EngineMessages.ProjectileMoved, ({ angle, newLocation, projectileId }) => {
            dispatch(updateProjectile({ projectileId, angle, newLocation }));
         });

         context.socket.on(EngineMessages.CharacterLostHp, ({ characterId, currentHp, amount }) => {
            const spellEffect = 'damage';
            dispatch(updateCharacterHp({ characterId, currentHp, amount, spellEffect }));
         });

         context.socket.on(EngineMessages.CharacterGotHp, ({ characterId, currentHp, amount }) => {
            const spellEffect = 'heal';
            dispatch(updateCharacterHp({ characterId, currentHp, amount, spellEffect }));
         });

         context.socket.on(EngineMessages.CharacterLostSpellPower, ({ characterId, currentSpellPower, amount }) => {
            dispatch(updateCharacterSpellPower({ characterId, currentSpellPower, amount }));
         });

         context.socket.on(EngineMessages.CharacterGotSpellPower, ({ characterId, currentSpellPower, amount }) => {
            dispatch(updateCharacterSpellPower({ characterId, currentSpellPower, amount }));
         });

         context.socket.on(EngineMessages.CharacterDied, ({ characterId }) => {
            dispatch(characterDied({ characterId }));
         });

         context.socket.on(EngineMessages.ProjectileRemoved, ({ projectileId }) => {
            dispatch(deleteProjectile({ projectileId }));
         });

         context.socket.on(FightingEngineMessages.SpellLanded, (event) => {});

         context.socket.on(FightingEngineMessages.AreaSpellEffectCreated, (event) => {
            dispatch(areaSpellEffectCreated({ event }));
         });

         context.socket.on(FightingEngineMessages.AreaSpellEffectRemoved, (event) => {
            dispatch(areaSpellEffectRemoved({ event }));
         });

         context.socket.on(FightingEngineMessages.ChannelingFinished, (event) => {
            dispatch(deleteActiveSpellCast({ event }));
         });

         context.socket.on(FightingEngineMessages.ChannelingInterrupted, (event) => {
            dispatch(deleteActiveSpellCast({ event }));
         });

         context.socket.on(FightingEngineMessages.SpellHasBeenCast, (event) => {
            dispatch(addActiveSpellCast({ event }));
         });
      }
   }, [context]);

   return <SocketContext.Provider value={context}>{children}</SocketContext.Provider>;
};

export default SocketCommunicator;
