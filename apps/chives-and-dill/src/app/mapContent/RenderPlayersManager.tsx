import { GlobalStoreModule } from '@bananos/types';
import { map } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { useEngineModuleReader } from '../../hooks';
import { selectCharacterViewsSettings } from '../../stores';
import Player from '../player/Player';


export const RenderPlayersManager = () => {
    const { data: characters, lastUpdateTime: charactersLastUpdateTime } = useEngineModuleReader(GlobalStoreModule.CHARACTER);
    const { data: characterMovements, lastUpdateTime: characterMovementsLastUpdateTime } = useEngineModuleReader(GlobalStoreModule.CHARACTER_MOVEMENTS);
    const { data: characterPowerPoints, lastUpdateTime: characterPowerPointsLastUpdateTime } = useEngineModuleReader(GlobalStoreModule.CHARACTER_POWER_POINTS);
    const characterViewsSettings = useSelector(selectCharacterViewsSettings);

    return <>{map(characters, (player, i) => (
        <Player
            key={i}
            player={player}
            characterViewsSettings={characterViewsSettings}
            charactersMovements={characterMovements}
            characterPowerPoints={characterPowerPoints}
            lastUpdate={charactersLastUpdateTime + "#" + characterMovementsLastUpdateTime + "#" + characterPowerPointsLastUpdateTime}
        />
    ))}</>;
};
