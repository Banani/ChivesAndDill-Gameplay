import React, { useCallback } from 'react';
import { Stage, Sprite, Container, AppContext } from '@inlet/react-pixi';
import { Provider, ReactReduxContext, useSelector } from 'react-redux';
import {
   selectCharacters,
   selectActivePlayer,
   getEngineState,
} from '../stores';
import _ from 'lodash';

import { PlayerIcon } from './player/playerIcon/PlayerIcon';
import { SpellsBar } from './player/spellsBar/SpellsBar';
import { QuestLog } from './player/quests/questLog/QuestLog';
import { QuestsSideView } from './player/quests/questSideView/QuestsSideView';
import { BlinkSpellEffect } from './mapContent/BlinkSpellEffect';
import { ClassesModal } from "./player/classesModal/classesModal";
import { DrawAreas } from './mapContent/DrawAreas';
import { CastBarsManager } from './mapContent/CastBarsManager';
import { RenderPlayersManager } from './mapContent/RenderPlayersManager';
import { AreasSpellsEffectsManager } from './mapContent/AreasSpellsEffectsManager';

const Map = () => {
   const players = useSelector(selectCharacters);
   const activePlayerId = useSelector(selectActivePlayer);
   const engineState = useSelector(getEngineState);

   const renderSpells = useCallback(
      () => _.map(engineState.projectileMovements, (spell, i) => <Sprite key={i} image="../assets/spritesheets/spells/potato.png" x={spell.location.x} y={spell.location.y}></Sprite>),
      [engineState.projectileMovements]
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
         {activePlayerId ? <SpellsBar /> : null}
         {activePlayerId ? <PlayerIcon player={players[activePlayerId]}></PlayerIcon> : null}
         {<QuestsSideView />}
         <QuestLog />
         {/* <ClassesModal /> */}
         <ReactReduxContext.Consumer>
            {({ store }) => (
               <Stage width={gameWidth} height={gameHeight} options={{ backgroundColor: 0x000000, autoDensity: true }}>
                  <AppContext.Consumer>
                     {(app) => (
                        <Provider store={store}>
                           {activePlayerId && engineState.characterMovements && (
                              <Container
                                 position={[
                                    -engineState?.characterMovements[activePlayerId].location.x * scale + gameWidth / 2 ?? 0,
                                    -engineState?.characterMovements[activePlayerId].location.y * scale + gameHeight / 2 ?? 0,
                                 ]}
                              >
                                 <AreasSpellsEffectsManager />
                                 <DrawAreas />
                                 {renderSpells()}
                                 <CastBarsManager />
                                 <RenderPlayersManager />
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
