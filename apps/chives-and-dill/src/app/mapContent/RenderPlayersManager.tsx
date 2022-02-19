import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import Player from '../player/Player';
import { selectCharacterViewsSettings, selectActiveCharacterId, selectCharacters, selectCharacterPowerPointsEvents } from '../../stores';
import _ from 'lodash';

export const RenderPlayersManager = () => {
   const players = useSelector(selectCharacters);
   const activePlayerId = useSelector(selectActiveCharacterId);
   const characterViewsSettings = useSelector(selectCharacterViewsSettings);

   const renderPlayers = useCallback(
      () => _.map(_.omit(players, [activePlayerId ?? 0]), (player, i) => <Player key={i} player={player} characterViewsSettings={characterViewsSettings} />),
      [players, characterViewsSettings, activePlayerId]
   );

   return (
      <>
         {renderPlayers()}
         {players[activePlayerId] ? <Player player={players[activePlayerId]} characterViewsSettings={characterViewsSettings} /> : null}
      </>
   );
};
