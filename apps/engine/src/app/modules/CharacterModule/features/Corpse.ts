
import { CharacterType, PlayerClientActions } from '@bananos/types';
import { EngineManager } from 'apps/engine/src/app/testUtilities';
import * as _ from 'lodash';
import { EngineEvents } from '../../../EngineEvents';
import { CharacterDiedEvent } from '../../../types';
import { CharacterUnion } from '../../../types/CharacterUnion';
import { Monster } from '../../MonsterModule/types';

export const killAnyMonster = (engineManager: EngineManager, playerId: string) => {
    const players = engineManager.getPlayers();
    const dataPackage = engineManager.getLatestPlayerDataPackage(players[playerId].socketId);
    const monster = _.find(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster) as Monster;

    engineManager.createSystemAction<CharacterDiedEvent>({
        type: EngineEvents.CharacterDied,
        characterId: monster.id,
        killerId: players[playerId].characterId,
        character: monster,
    });

    return { monster, dataPackage: engineManager.getLatestPlayerDataPackage(players[playerId].socketId) };
}

export const getNewestCorpseId = (engineManager: EngineManager, playerId: string) => {
    const players = engineManager.getPlayers();
    const dataPackage = engineManager.getLatestPlayerDataPackage(players[playerId].socketId);
    return Object.keys(dataPackage.corpseDrop.data)[0];
}

interface OpenAnyCorpseProps {
    engineManager: EngineManager;
    playerId: string;
    corpseId?: string;
}

export const openAnyCorpse = (props: OpenAnyCorpseProps) => {
    const { engineManager, playerId } = props;
    const players = engineManager.getPlayers();
    const corpseId = props.corpseId ? props.corpseId : getNewestCorpseId(engineManager, playerId);

    engineManager.callPlayerAction(players[playerId].socketId, {
        type: PlayerClientActions.OpenLoot,
        corpseId,
    });

    return { dataPackage: engineManager.getLatestPlayerDataPackage(players[playerId].socketId), corpseId };
}

export const getDroppedItemIds = (engineManager: EngineManager, playerId: string, corpseId: string) => {
    const players = engineManager.getPlayers();
    const dataPackage = engineManager.getLatestPlayerDataPackage(players[playerId].socketId);
    return Object.keys(dataPackage.activeLoot.data[corpseId].items);
}

interface PickOneItemFromCorpseProps {
    engineManager: EngineManager;
    playerId: string;
    corpseId: string;
    itemId?: string;
}

export const pickOneItemFromCorpse = (props: PickOneItemFromCorpseProps) => {
    const players = props.engineManager.getPlayers();
    const itemId = props.itemId ? props.itemId : getDroppedItemIds(props.engineManager, props.playerId, props.corpseId)[0];

    props.engineManager.callPlayerAction(players[props.playerId].socketId, {
        type: PlayerClientActions.PickItemFromCorpse,
        corpseId: props.corpseId,
        itemId,
    });

    return { dataPackage: props.engineManager.getLatestPlayerDataPackage(players[props.playerId].socketId) };
}