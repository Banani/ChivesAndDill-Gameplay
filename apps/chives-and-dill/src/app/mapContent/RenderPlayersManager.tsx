import { GlobalStoreModule } from '@bananos/types';
import { map } from 'lodash';
import React from 'react';
import { useEngineModuleReader } from '../../hooks';
import Player from '../player/Player';


export const RenderPlayersManager = () => {
    const { data: characters, lastUpdateTime: charactersLastUpdateTime } = useEngineModuleReader(GlobalStoreModule.CHARACTER);
    const { data: characterMovements, lastUpdateTime: characterMovementsLastUpdateTime } = useEngineModuleReader(GlobalStoreModule.CHARACTER_MOVEMENTS);
    const { data: characterPowerPoints, lastUpdateTime: characterPowerPointsLastUpdateTime } = useEngineModuleReader(GlobalStoreModule.CHARACTER_POWER_POINTS);
    const characterViewsSettings = {} as any;

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
