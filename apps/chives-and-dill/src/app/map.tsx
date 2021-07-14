import React from 'react';
import { Stage, Sprite, Graphics, Container } from '@inlet/react-pixi';
import { useSelector } from 'react-redux';
import { selectCharacters, selectCharacterViewsSettings, selectAreas, selectActivePlayer, selectSpells } from '../stores';
import _ from 'lodash';
import Player from './Player';

const Map = () => {
   const players = useSelector(selectCharacters);
   const spells = useSelector(selectSpells);
   const characterViewsSettings = useSelector(selectCharacterViewsSettings);
   const activePlayerId = useSelector(selectActivePlayer);
   const areas = useSelector(selectAreas);

   const renderPlayers = React.useCallback(_.map(_.omit(players, [activePlayerId ?? 0]), (player, i) =>
   // console.log('render'); 
   (
      <Player key={i} player={player} characterViewsSettings={characterViewsSettings} />
   )
   ), [players, characterViewsSettings]);

   const renderSpells = _.map(spells, (spell, i) => (
      <Sprite key={i} image="../assets/spritesheets/spells/potato.png" x={spell.newLocation.x} y={spell.newLocation.y}></Sprite>
   ));

   const drawAreas = React.useCallback(
      (g) => {
         areas.forEach((obstacle) => {
            g.beginFill(0xD94911);
            g.lineStyle(4, 0xcccccc, 1);
            g.drawPolygon(obstacle.flat());
            g.endFill();
         });
      },
      [areas]
   );

   const drawBorders = React.useCallback((g) => {
      g.clear();
      g.lineStyle(2, 0xcccccc, 1)
      g.moveTo(0, 0)
      g.lineTo(3936, 0)
      g.lineTo(3936, 4408)
      g.lineTo(0, 4408)
      g.lineTo(0, 0);
      g.endFill()
   }, []);

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

   const scale = 1;
   console.log('render');
   return (
      <Stage
         width={gameWidth}
         height={gameHeight}
         options={{ backgroundColor: 0x000000, autoDensity: true }}
      >
         {activePlayerId && <Container
            position={[
               -players[activePlayerId]?.location.x * scale + gameWidth / 2 ?? 0,
               -players[activePlayerId]?.location.y * scale + gameHeight / 2 ?? 0]}
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
            <Graphics draw={drawBorders} />
         </Container>}
      </Stage>
   );
};

export default Map;
