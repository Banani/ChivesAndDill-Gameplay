import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import Player from '../player/Player';
import { selectCharacterViewsSettings, selectActiveCharacterId, selectCharacters, getCharactersMovements, selectCharacterPowerPointsEvents } from '../../stores';
import _ from 'lodash';

export const RenderPlayersManager = () => {
   const players = useSelector(selectCharacters);
   const activePlayerId = useSelector(selectActiveCharacterId);
   const characterViewsSettings = useSelector(selectCharacterViewsSettings);
   const charactersMovements = useSelector(getCharactersMovements);
   const characterPowerPoints = useSelector(selectCharacterPowerPointsEvents);

   const renderPlayers = useCallback(
      () => _.map(_.omit(players, [activePlayerId ?? 0]), (player, i) => <Player key={i} player={player} characterViewsSettings={characterViewsSettings} charactersMovements={charactersMovements} characterPowerPoints={characterPowerPoints} />),
      [players, characterViewsSettings, activePlayerId, charactersMovements, characterPowerPoints]
   );

   return (
      <>
         {renderPlayers()}
         {players[activePlayerId] ? <Player charactersMovements={charactersMovements} player={players[activePlayerId]} characterViewsSettings={characterViewsSettings} characterPowerPoints={characterPowerPoints} /> : null}
      </>
   );
};
