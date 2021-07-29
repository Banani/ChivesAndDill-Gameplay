import React, { useCallback } from 'react';
import { Stage, Sprite, Graphics, Container } from '@inlet/react-pixi';
import { useSelector } from 'react-redux';
import {
   selectCharacters,
   selectCharacterViewsSettings,
   selectAreas, selectActivePlayer,
   selectProjectiles,
   selectAreaSpellsEffects,
   selectActiveSpellsCasts,
} from '../stores';
import _ from 'lodash';
import Player from './player/Player';
import { PlayerIcon } from "./player/playerIcon/PlayerIcon";
import { SpellsBar } from "./player/spellsBar/SpellsBar";

const Map = () => {
   const players = useSelector(selectCharacters);
   const projectiles = useSelector(selectProjectiles);
   const areaSpellsEffects = useSelector(selectAreaSpellsEffects);
   const characterViewsSettings = useSelector(selectCharacterViewsSettings);
   const activePlayerId = useSelector(selectActivePlayer);
   const areas = useSelector(selectAreas);
   const activeSpellsCasts = useSelector(selectActiveSpellsCasts);

   const renderPlayers = useCallback(_.map(_.omit(players, [activePlayerId ?? 0]), (player, i) =>
   (
      <Player key={i} player={player} characterViewsSettings={characterViewsSettings} />
   )
   ), [players, characterViewsSettings]);

   const renderSpells = _.map(projectiles, (spell, i) => (
      <Sprite key={i} image="../assets/spritesheets/spells/potato.png" x={spell.newLocation.x} y={spell.newLocation.y}></Sprite>
   ));

   const drawAreasSpellsEffects = useCallback((g) => {
      g.clear();
      _.map(areaSpellsEffects, (areaSpellEffect, index) => {
         g.beginFill(0x333333);
         g.drawCircle(areaSpellEffect.location.x, areaSpellEffect.location.y, areaSpellEffect.effect.radius);
         g.endFill();
      });
   }, [areaSpellsEffects]);

   const drawAreas = useCallback(
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

   const drawBorders = useCallback((g) => {
      g.clear();
      g.lineStyle(2, 0xcccccc, 1)
      g.moveTo(0, 0)
      g.lineTo(3936, 0)
      g.lineTo(3936, 4408)
      g.lineTo(0, 4408)
      g.lineTo(0, 0);
      g.endFill()
   }, []);

   let channelSpellProgress;
   
   if (activeSpellsCasts[activePlayerId]) {
      const { spellCastTimeStamp, castTime } = activeSpellsCasts[players[activePlayerId].id];
      channelSpellProgress = (Date.now() - spellCastTimeStamp) / castTime;
   }

   const castBar = useCallback(
      (g) => {
         g.clear();
         g.beginFill(0xcfcfcf);
         g.drawRect(players[activePlayerId]?.location.x - 25, players[activePlayerId]?.location.y + 30, 50, 5);
         g.endFill();
         g.beginFill(0x2372fa);
         g.drawRect(players[activePlayerId]?.location.x - 25, players[activePlayerId]?.location.y + 30, (channelSpellProgress * 100) / 2, 5);
         g.endFill();
      },
      [players, activePlayerId, channelSpellProgress]
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

   const scale = 1;
   return (
      <>
         {activePlayerId ? <SpellsBar player={players[activePlayerId]}></SpellsBar> : null}
         {activePlayerId ? <PlayerIcon player={players[activePlayerId]}></PlayerIcon> : null}
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
               <Graphics draw={drawAreasSpellsEffects} />
               {renderSpells}
               {renderPlayers}
               {channelSpellProgress ? <Graphics draw={castBar} /> : null}
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
      </>
   );
};

export default Map;
