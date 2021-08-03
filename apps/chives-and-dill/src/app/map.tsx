import React, { useCallback } from 'react';
import { Stage, Sprite, Graphics, Container, AppContext } from '@inlet/react-pixi';
import { Provider, ReactReduxContext, useSelector } from 'react-redux';
import {
   selectCharacters,
   selectCharacterViewsSettings,
   selectAreas,
   selectActivePlayer,
   selectProjectiles,
   selectAreaSpellsEffects,
   selectActiveSpellsCasts,
} from '../stores';
import _ from 'lodash';
import Player from './player/Player';
import { PlayerIcon } from './player/playerIcon/PlayerIcon';
import { SpellsBar } from './player/spellsBar/SpellsBar';
import QuestLog from "./player/quests/questLog/QuestLog";
import { QuestsSideView } from './player/quests/questSideView/QuestsSideView';
import { CastBar } from './mapContent/CastBar';
import { BlinkSpellEffect } from './mapContent/BlinkSpellEffect';

const Map = () => {
   const players = useSelector(selectCharacters);
   const projectiles = useSelector(selectProjectiles);
   const areaSpellsEffects = useSelector(selectAreaSpellsEffects);
   const characterViewsSettings = useSelector(selectCharacterViewsSettings);
   const activePlayerId = useSelector(selectActivePlayer);
   const areas = useSelector(selectAreas);
   const activeSpellsCasts = useSelector(selectActiveSpellsCasts);

   const renderPlayers = useCallback(
      _.map(_.omit(players, [activePlayerId ?? 0]), (player, i) => <Player key={i} player={player} characterViewsSettings={characterViewsSettings} />),
      [players, characterViewsSettings]
   );

   const renderSpells = _.map(projectiles, (spell, i) => (
      <Sprite key={i} image="../assets/spritesheets/spells/potato.png" x={spell.newLocation.x} y={spell.newLocation.y}></Sprite>
   ));

   const drawAreasSpellsEffects = useCallback(
      (g) => {
         g.clear();
         _.map(areaSpellsEffects, (areaSpellEffect, index) => {
            g.beginFill(0x333333);
            g.drawCircle(areaSpellEffect.location.x, areaSpellEffect.location.y, areaSpellEffect.effect.radius);
            g.endFill();
         });
      },
      [areaSpellsEffects]
   );

   const drawAreas = useCallback(
      (g) => {
         areas.forEach((obstacle) => {
            g.beginFill(0xd94911);
            g.lineStyle(4, 0xcccccc, 1);
            g.drawPolygon(obstacle.flat());
            g.endFill();
         });
      },
      [areas]
   );

   const drawBorders = useCallback((g) => {
      g.clear();
      g.lineStyle(2, 0xcccccc, 1);
      g.moveTo(0, 0);
      g.lineTo(3936, 0);
      g.lineTo(3936, 4408);
      g.lineTo(0, 4408);
      g.lineTo(0, 0);
      g.endFill();
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

   const [questOpen, setQuestOpen] = React.useState(false);

   return (
      <>
         {activePlayerId ? <SpellsBar player={players[activePlayerId]}></SpellsBar> : null}
         {activePlayerId ? <PlayerIcon player={players[activePlayerId]}></PlayerIcon> : null}
         {<QuestsSideView />}
         <QuestLog trigger={questOpen} setTrigger={setQuestOpen} />
         <button className="qOpen" onClick={() => setQuestOpen(!questOpen)}>Q</button>
         <ReactReduxContext.Consumer>
            {({ store }) => (
               <Stage width={gameWidth} height={gameHeight} options={{ backgroundColor: 0x000000, autoDensity: true }}>
                  <AppContext.Consumer>
                     {(app) => (
                        <Provider store={store}>
                           {activePlayerId && (
                              <Container
                                 position={[
                                    -players[activePlayerId]?.location.x * scale + gameWidth / 2 ?? 0,
                                    -players[activePlayerId]?.location.y * scale + gameHeight / 2 ?? 0,
                                 ]}
                              >
                                 <Graphics draw={drawAreasSpellsEffects} />
                                 {renderSpells}
                                 {renderPlayers}
                                 <CastBar activeSpellsCasts={activeSpellsCasts} activePlayerId={activePlayerId} players={players} />
                                 {players[activePlayerId] ? <Player player={players[activePlayerId]} characterViewsSettings={characterViewsSettings} /> : null}

                                 {areas.length !== 0 ? <Graphics draw={drawAreas} /> : null}
                                 <Graphics draw={drawBorders} />

                                 <BlinkSpellEffect />
                              </Container>
                           )}
                        </Provider>
                     )}
                  </AppContext.Consumer>
               </Stage>
            )}
         </ReactReduxContext.Consumer>
      </>
   );
};

export default Map;
