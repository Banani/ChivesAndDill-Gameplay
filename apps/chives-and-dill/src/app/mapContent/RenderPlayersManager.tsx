import _ from 'lodash';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useEnginePackageProvider } from '../../hooks';
import { selectCharacterViewsSettings } from '../../stores';
import Player from '../player/Player';

export const RenderPlayersManager = () => {
   const { activeCharacterId, characters, characterMovements, characterPowerPoints } = useEnginePackageProvider();
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
            />
         ) : null}
      </>
   );
};
