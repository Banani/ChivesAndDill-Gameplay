import { GlobalStoreModule } from '@bananos/types';
import _ from 'lodash';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useEngineModuleReader } from '../../hooks';
import { selectCharacterViewsSettings } from '../../stores';
import Player from '../player/Player';

export const RenderPlayersManager = ({ keyBoardContext }) => {
   const { activeCharacterId } = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER).data;
   const { data: characters } = useEngineModuleReader(GlobalStoreModule.CHARACTER);
   const { data: characterMovements } = useEngineModuleReader(GlobalStoreModule.CHARACTER_MOVEMENTS);
   const { data: characterPowerPoints } = useEngineModuleReader(GlobalStoreModule.CHARACTER_POWER_POINTS);
   const characterViewsSettings = useSelector(selectCharacterViewsSettings);

   const renderPlayers = useCallback(
      () =>
         _.map(_.omit(characters, [activeCharacterId ?? 0]), (player, i) => (
            <Player
               key={i}
               player={player}
               characterViewsSettings={characterViewsSettings}
               charactersMovements={characterMovements}
               characterPowerPoints={characterPowerPoints}
               keyBoardContext={keyBoardContext}
            />
         )),
      [characters, characterViewsSettings, activeCharacterId, characterMovements, characterPowerPoints]
   );

   return (
      <>
         {renderPlayers()}
         {characters[activeCharacterId] ? (
            <Player
               charactersMovements={characterMovements}
               player={characters[activeCharacterId]}
               characterViewsSettings={characterViewsSettings}
               characterPowerPoints={characterPowerPoints}
               keyBoardContext={keyBoardContext}
            />
         ) : null}
      </>
   );
};
