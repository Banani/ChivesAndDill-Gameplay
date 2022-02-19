import React, { useCallback, useEffect, useState } from 'react';
import { Stage, Sprite, Container, AppContext } from '@inlet/react-pixi';
import { Provider, ReactReduxContext, useSelector } from 'react-redux';
import { getEngineState, selectActiveCharacterId } from '../stores';
import _ from 'lodash';

import { PlayerIcon } from './player/playerIcon/PlayerIcon';
import { SpellsBar } from './player/spellsBar/SpellsBar';
import { QuestLog } from './player/quests/questLog/QuestLog';
import { QuestsSideView } from './player/quests/questSideView/QuestsSideView';
import { BlinkSpellEffect } from './mapContent/BlinkSpellEffect';
import { AreasManager } from './mapContent/AreasManager';
import { CastBarsManager } from './mapContent/CastBarsManager';
import { RenderPlayersManager } from './mapContent/RenderPlayersManager';
import { AreasSpellsEffectsManager } from './mapContent/AreasSpellsEffectsManager';
import { TargetIcon } from './mapContent/targetIcon/TargetIcon';

const Map = () => {
   const activePlayerId = useSelector(selectActiveCharacterId);
   const engineState = useSelector(getEngineState);
   const [gameSize, setGameSize] = useState({ width: 0, height: 0 });

   const renderSpells = useCallback(
      () =>
         _.map(engineState.projectileMovements.data, (spell, i) => (
            <Sprite key={i} image="../assets/spritesheets/spells/potato.png" x={spell.location.x} y={spell.location.y}></Sprite>
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

   const scale = 1;

   return (
      <>
         {activePlayerId ? <SpellsBar /> : null}
         {activePlayerId ? <PlayerIcon playerId={activePlayerId}></PlayerIcon> : null}
         <TargetIcon />
         {<QuestsSideView />}
         <QuestLog />
         <ReactReduxContext.Consumer>
            {({ store }) => (
               <Stage width={gameSize.width} height={gameSize.height} options={{ backgroundColor: 0x000000, autoDensity: true }}>
                  <AppContext.Consumer>
                     {(app) => (
                        <Provider store={store}>
                           {activePlayerId && engineState.characterMovements && (
                              <Container
                                 position={[
                                    -(engineState?.characterMovements.data[activePlayerId]?.location.x ?? 0) * scale + gameSize.width / 2,
                                    -(engineState?.characterMovements.data[activePlayerId]?.location.y ?? 0) * scale + gameSize.height / 2,
                                 ]}
                              >
                                 <AreasSpellsEffectsManager />
                                 <AreasManager />
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
