import React from 'react';
import { Stage, Sprite, Graphics } from '@inlet/react-pixi';
import { useSelector } from 'react-redux';
import {
  selectCharacters,
  selectCharacterViewsSettings,
  selectAreas,
  selectActivePlayer,
  selectSpells,
} from '../stores';
import _ from 'lodash';
import Player from './Player';

const Map = () => {
  const players = useSelector(selectCharacters);
  const spells = useSelector(selectSpells);
  const characterViewsSettings = useSelector(selectCharacterViewsSettings);
  const activePlayerId = useSelector(selectActivePlayer);
  const areas = useSelector(selectAreas);

  const renderPlayers = _.map(
    _.omit(players, [activePlayerId ?? 0]),
    (player, i) => (
      <Player
        key={i}
        player={player}
        characterViewsSettings={characterViewsSettings}
      />
    )
  );

  const renderSpells = _.map(spells, (spell, i) => (
    <Sprite
      key={i}
      image="../assets/spritesheets/spells/potato.png"
      x={spell.newLocation.x}
      y={spell.newLocation.y}
    ></Sprite>
  ));

  const drawAreas = React.useCallback(
    (g) => {
      areas.forEach((obstacle) => {
        g.beginFill(0xff3300);
        g.lineStyle(4, 0xffffff, 1);
        g.drawPolygon(obstacle.flat());
        g.endFill();
      });
    },
    [areas]
  );

  let gameWidth;
  let gameHeight;

  const resizeGame = () => {
    gameWidth = window.innerWidth;
    gameHeight = window.innerHeight;
    const ratio = 16 / 9;

    if (gameHeight < gameWidth / ratio) {
      gameWidth = gameHeight * ratio;
    } else {
      gameHeight = gameWidth / ratio;
    }
  };

  resizeGame();

  window.addEventListener('resize', () => {
    resizeGame();
  });

  let scale = gameWidth / 1000;
  return (
    <Stage
      width={gameWidth}
      height={gameHeight}
      options={{ backgroundColor: 0xa1a1a1, autoDensity: true }}
    >
      <Sprite
        image="http://localhost:4200/assets/maps/map1.png"
        scale={scale}
        x={-players[activePlayerId]?.location.x * scale + gameWidth / 2 ?? 0}
        y={-players[activePlayerId]?.location.y * scale + gameHeight / 2 ?? 0}
      >
        {renderSpells}
        {renderPlayers}
        {players[activePlayerId] ? (
          <Player
            player={players[activePlayerId]}
            characterViewsSettings={characterViewsSettings}
          />
        ) : null}
        {areas.length !== 0 ? <Graphics draw={drawAreas} /> : null}
      </Sprite>
    </Stage>
  );
};

export default Map;
