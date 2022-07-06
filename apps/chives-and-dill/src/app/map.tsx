import React, { useCallback, useEffect, useState } from 'react';
import { Stage, Sprite, Container, AppContext } from '@inlet/react-pixi';
import { Provider, ReactReduxContext, useSelector } from 'react-redux';
import { getEngineState, selectActiveCharacterId, selectMapSchema } from '../stores';
import _ from 'lodash';

import { SpellsBar } from './guiContent/spellsBar/SpellsBar';
import { QuestLog } from './guiContent/quests/questLog/QuestLog';
import { QuestsSideView } from './guiContent/quests/questSideView/QuestsSideView';
import { BlinkSpellEffect } from './mapContent/BlinkSpellEffect';
import { AreasManager } from './mapContent/AreasManager';
import { CastBarsManager } from './mapContent/CastBarsManager';
import { RenderPlayersManager } from './mapContent/RenderPlayersManager';
import { AreasSpellsEffectsManager } from './mapContent/AreasSpellsEffectsManager';
import { FloatingNumbersManager } from './mapContent/FloatingNumbersManager';
import { ErrorMessages } from './mapContent/ErrorMessages';
import { BloodPoolManager } from './mapContent/bloodPoolsManager';
import { ActivePlayerTimeEffects } from './guiContent/activePlayerTimeEffects/ActivePlayerTimeEffects';
import { MapManager } from './mapContent/mapManager/MapManager';
import { CharacterFrames } from './guiContent/characterFrames/characterFrames';
import { ExperienceBar } from './guiContent/experienceBar/ExperienceBar';
import { Chat } from './guiContent/chat/Chat';

const Map = () => {
   const activePlayerId = useSelector(selectActiveCharacterId);
   const engineState = useSelector(getEngineState);
   const mapSchema = useSelector(selectMapSchema);
   const [gameSize, setGameSize] = useState({ width: 0, height: 0 });

   const renderSpells = useCallback(
      () =>
         _.map(engineState.projectileMovements.data, (spell, i) => (
            <Sprite
               rotation={spell.angle + 1.5}
               scale={2}
               key={i}
               image="../assets/spritesheets/spells/mage/spellsView/fireball.png"
               x={spell.location.x}
               y={spell.location.y}
            ></Sprite>
         )),
      [engineState.projectileMovements]
   );

   const resizeGame = () => {
      let gameWidth = window.innerWidth;
      let gameHeight = window.innerHeight;
      const ratio = 16 / 9;

      if (gameHeight < gameWidth / ratio) {
         gameWidth = gameHeight * ratio;
      } else {
         gameHeight = gameWidth / ratio;
      }

      setGameSize({ width: gameWidth, height: gameHeight });
   };

   useEffect(() => {
      resizeGame();
      window.addEventListener('resize', resizeGame);

      return () => {
         window.removeEventListener('resize', resizeGame);
      };
   }, []);

   return (
      <>
         {activePlayerId ? <SpellsBar /> : null}
         {activePlayerId ? <ActivePlayerTimeEffects playerId={activePlayerId} /> : null}
         <CharacterFrames />
         {<QuestsSideView />}
         <QuestLog />
         <Chat />
         <ExperienceBar />
         <ReactReduxContext.Consumer>
            {({ store }) => (
               <Stage width={gameSize.width} height={gameSize.height} options={{ backgroundColor: 0x000000, autoDensity: true }}>
                  <AppContext.Consumer>
                     {(app) => (
                        <Provider store={store}>
                           {activePlayerId && engineState.characterMovements && (
                              <Container
                                 position={[
                                    -(engineState?.characterMovements.data[activePlayerId]?.location.x ?? 0) + gameSize.width / 2,
                                    -(engineState?.characterMovements.data[activePlayerId]?.location.y ?? 0) + gameSize.height / 2,
                                 ]}
                              >
                                 <AreasSpellsEffectsManager />
                                 <MapManager mapSchema={mapSchema} location={engineState?.characterMovements.data[activePlayerId]?.location} />
                                 <AreasManager />
                                 {renderSpells()}
                                 <CastBarsManager />
                                 <RenderPlayersManager />
                                 <FloatingNumbersManager />
                                 <BlinkSpellEffect />
                                 <BloodPoolManager />
                                 <ErrorMessages />
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
