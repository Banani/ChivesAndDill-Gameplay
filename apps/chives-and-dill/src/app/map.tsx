import React, { useCallback } from 'react';
import { Stage, Sprite, Graphics, Container, AppContext } from '@inlet/react-pixi';
import { Provider, ReactReduxContext, useSelector } from 'react-redux';
import {
   selectCharacters,
   selectCharacterViewsSettings,
   selectAreas,
   selectActivePlayer,
   selectAreaSpellsEffects,
   getEngineState,
   selectActiveSpellsCasts,
} from '../stores';
import _ from 'lodash';
import Player from './player/Player';
import { PlayerIcon } from './player/playerIcon/PlayerIcon';
import { SpellsBar } from './player/spellsBar/SpellsBar';
import { QuestLog } from './player/quests/questLog/QuestLog';
import { QuestsSideView } from './player/quests/questSideView/QuestsSideView';
import { CastBar } from './mapContent/CastBar';
import { BlinkSpellEffect } from './mapContent/BlinkSpellEffect';
import { GlobalStore } from '@bananos/types';

const Map = () => {
   const players = useSelector(selectCharacters);
   const areaSpellsEffects = useSelector(selectAreaSpellsEffects);
   const characterViewsSettings = useSelector(selectCharacterViewsSettings);
   const activePlayerId = useSelector(selectActivePlayer);
   const areas = useSelector(selectAreas);
   const engineState = useSelector(getEngineState);
   const activeSpellsCasts = useSelector(selectActiveSpellsCasts);

   const renderPlayers = useCallback(
      () => _.map(_.omit(players, [activePlayerId ?? 0]), (player, i) => <Player key={i} player={player} characterViewsSettings={characterViewsSettings} />),
      [players, characterViewsSettings, activePlayerId]
   );

   const renderSpells = useCallback(
      () =>
         _.map(engineState.projectileMovements.data, (spell, i) => (
            <Sprite key={i} image="../assets/spritesheets/spells/potato.png" x={spell.location.x} y={spell.location.y}></Sprite>
         )),
      [engineState.projectileMovements]
   );

   const renderCastBars = useCallback(() => _.map(activeSpellsCasts, (spellCast, i) => <CastBar playerId={i} />), [activeSpellsCasts]);

   const drawAreasSpellsEffects = useCallback(
      (g) => {
         g.clear();
         _.map(areaSpellsEffects, (areaSpellEffect: any, index) => {
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

   return (
      <>
         {activePlayerId ? <SpellsBar /> : null}
         {activePlayerId ? <PlayerIcon player={players[activePlayerId]}></PlayerIcon> : null}
         {<QuestsSideView />}
         <QuestLog />
         <ReactReduxContext.Consumer>
            {({ store }) => (
               <Stage width={gameWidth} height={gameHeight} options={{ backgroundColor: 0x000000, autoDensity: true }}>
                  <AppContext.Consumer>
                     {(app) => (
                        <Provider store={store}>
                           {activePlayerId && engineState.characterMovements && (
                              <Container
                                 position={[
                                    -(engineState?.characterMovements.data[activePlayerId]?.location.x ?? 0) * scale + gameWidth / 2,
                                    -(engineState?.characterMovements.data[activePlayerId]?.location.y ?? 0) * scale + gameHeight / 2,
                                 ]}
                              >
                                 <Graphics draw={drawAreasSpellsEffects} />
                                 {areas.length ? <Graphics draw={drawAreas} /> : null}
                                 <Graphics draw={drawBorders} />
                                 {renderSpells()}
                                 {renderPlayers()}
                                 {renderCastBars()}
                                 {players[activePlayerId] ? <Player player={players[activePlayerId]} characterViewsSettings={characterViewsSettings} /> : null}

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
