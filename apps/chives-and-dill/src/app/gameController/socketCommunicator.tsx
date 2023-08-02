import { EngineMessages, FightingEngineMessages } from '@bananos/types';
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { PackageContext } from '../../contexts/PackageContext';
import { environment } from '../../environments/environment';
import {
    addActiveSpellCast,
    addPlayer,
    addSpellLanded,
    areaSpellEffectCreated,
    areaSpellEffectRemoved,
    characterDied,
    deleteActiveSpellCast,
    deletePlayer,
    initializePlayers,
    initializeSpells,
    updateCharacterHp,
    updateCharacterSpellPower,
} from '../../stores';
import { SocketContext } from './socketContext';

const SocketCommunicator = ({ children }) => {
    const [context, setContext] = useState<any>({});
    const dispatch = useDispatch();
    const packageContext = useContext(PackageContext);

    useEffect(() => {
        const URL = environment.engineUrl;
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

            context.socket.on(EngineMessages.UserConnected, ({ player }) => {
                dispatch(addPlayer({ player }));
            });

            context.socket.on(EngineMessages.UserDisconnected, ({ userId }) => {
                dispatch(deletePlayer({ userId }));
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

            context.socket.on(FightingEngineMessages.SpellLanded, (event) => {
                dispatch(addSpellLanded({ event }));
            });

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

            context.socket.off(EngineMessages.Package);
            context.socket.on(EngineMessages.Package, (enginePackage) => {
                packageContext.updatePackage(enginePackage);
            });
        }
    }, [context, packageContext.updatePackage]);

    return <SocketContext.Provider value={context}>{children}</SocketContext.Provider>;
};

export default SocketCommunicator;
