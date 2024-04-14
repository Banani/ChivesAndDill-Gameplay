import { Location, SpellClientActions } from '@bananos/types';
import { EngineManager } from 'apps/engine/src/app/testUtilities/index';

interface AttackMonsterProps {
    engineManager: EngineManager,
    playerId: string,
    spellId: string,
    monsterId: string,
    location: Location
}

export const attackMonster = (props: AttackMonsterProps) => {
    const players = props.engineManager.getPlayers();

    props.engineManager.callPlayerAction(players[props.playerId].socketId, {
        type: SpellClientActions.CastSpell,
        directionLocation: props.location,
        spellId: props.spellId,
        targetId: props.monsterId
    })

    return { dataPackage: props.engineManager.getLatestPlayerDataPackage(players[props.playerId].socketId) };
}

interface CastSpellProps {
    engineManager: EngineManager,
    playerId: string,
    directionLocation: Location;
    targetId?: string;
    spellId: string;
}

export const castSpell = (props: CastSpellProps) => {
    const players = props.engineManager.getPlayers();

    props.engineManager.callPlayerAction(players[props.playerId].socketId, {
        type: SpellClientActions.CastSpell,
        directionLocation: props.directionLocation,
        spellId: props.spellId,
        targetId: props.targetId
    })

    return { dataPackage: props.engineManager.getLatestPlayerDataPackage(players[props.playerId].socketId) };
}

