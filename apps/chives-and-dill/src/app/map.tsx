import React, { useCallback } from 'react';
import { Stage, Sprite, Container, AppContext } from '@inlet/react-pixi';
import { Provider, ReactReduxContext, useSelector } from 'react-redux';
import { selectActivePlayer, getEngineState } from '../stores';
import _ from 'lodash';

import { PlayerIcon } from './player/playerIcon/PlayerIcon';
import { SpellsBar } from './player/spellsBar/SpellsBar';
import { QuestLog } from './player/quests/questLog/QuestLog';
import { QuestsSideView } from './player/quests/questSideView/QuestsSideView';
import { BlinkSpellEffect } from './mapContent/BlinkSpellEffect';
import { DrawAreas } from './mapContent/DrawAreas';
import { CastBarsManager } from './mapContent/CastBarsManager';
import { RenderPlayersManager } from './mapContent/RenderPlayersManager';
import { AreasSpellsEffectsManager } from './mapContent/AreasSpellsEffectsManager';
import { FloatingNumbersManager } from "./mapContent/FloatingNumbersManager";
import { TargetIcon } from './mapContent/targetIcon/TargetIcon';
import { BloodPoolManager } from './mapContent/bloodPoolsManager';

const Map = () => {
   const activePlayerId = useSelector(selectActivePlayer);
   const engineState = useSelector(getEngineState);

   const renderSpells = useCallback(
      () =>
         _.map(engineState.projectileMovements.data, (spell, i) => <Sprite rotation={spell.angle + 1.5} key={i} image="../assets/spritesheets/spells/mage/spellsView/fireball.png" x={spell.location.x} y={spell.location.y}></Sprite>),
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
         {activePlayerId ? <PlayerIcon playerId={activePlayerId}></PlayerIcon> : null}
         <TargetIcon />
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
                                    -(engineState?.characterMovements.data[activePlayerId]?.location.x ?? 0) * scale + gameWidth / 2,
                                    -(engineState?.characterMovements.data[activePlayerId]?.location.y ?? 0) * scale + gameHeight / 2,
                                 ]}
                              >
                                 <AreasSpellsEffectsManager />
                                 <DrawAreas />
                                 {renderSpells()}
                                 <CastBarsManager />
                                 <RenderPlayersManager />
                                 <FloatingNumbersManager />
                                 <BlinkSpellEffect />
                                 <BloodPoolManager />
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
