import { Container, Sprite, Stage } from '@inlet/react-pixi';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { Provider, ReactReduxContext } from 'react-redux';
import { SocketContext } from './gameController/socketContext';

import { ErrorMessage } from '@bananos/types';
import { Chat } from '@mui/icons-material';
import { PackageContext } from '../contexts/packageContext';
import { useEnginePackageProvider } from '../hooks';
import { ActivePlayerTimeEffects } from './guiContent/activePlayerTimeEffects/ActivePlayerTimeEffects';
import { CharacterFrames } from './guiContent/characterFrames/CharacterFrames';
import { ExperienceBar } from './guiContent/experienceBar/ExperienceBar';
import { LootModal } from './guiContent/lootModal/LootModal';
import { NpcModal } from './guiContent/npcModal/NpcModal';
import { QuestLog } from './guiContent/quests/questLog/QuestLog';
import { QuestsSideView } from './guiContent/quests/questSideView/QuestsSideView';
import { SpellsBar } from './guiContent/spellsBar/SpellsBar';
import { AreasManager } from './mapContent/AreasManager';
import { AreasSpellsEffectsManager } from './mapContent/AreasSpellsEffectsManager';
import { BlinkSpellEffect } from './mapContent/BlinkSpellEffect';
import { BloodPoolManager } from './mapContent/BloodPoolsManager';
import { CastBarsManager } from './mapContent/CastBarsManager';
import { ErrorMessages } from './mapContent/ErrorMessages';
import { FloatingNumbersManager } from './mapContent/FloatingNumbersManager';
import { MapWrapper } from './mapContent/mapManager/MapWrapper';
import { NextLevelManager } from './mapContent/NextLevelManager';
import { RenderPlayersManager } from './mapContent/RenderPlayersManager';

const Map = () => {
   const {
      activeCharacterId,
      mapSchema,
      spellChannels,
      characterMovements,
      activeLoot,
      activeConversation,
      characters,
      questDefinition,
      projectileMovements,
      experienceEvents,
      errorMessagesEvents,
   } = useEnginePackageProvider();

   const activeNpc = characters[activeConversation?.[activeCharacterId]?.npcId];
   const [gameSize, setGameSize] = useState({ width: 0, height: 0 });

   const renderSpells = useCallback(
      () =>
         _.map(projectileMovements, (spell, i) => (
            <Sprite
               rotation={spell.angle + 1.5}
               scale={2}
               key={i}
               image="../assets/spritesheets/spells/mage/spellsView/fireball.png"
               x={spell.location.x}
               y={spell.location.y}
            ></Sprite>
         )),
      [projectileMovements]
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
         {activeCharacterId ? <SpellsBar /> : null}
         {activeCharacterId ? <ActivePlayerTimeEffects playerId={activeCharacterId} /> : null}
         <CharacterFrames />
         {<QuestsSideView />}
         <QuestLog />
         <Chat />
         {!_.isEmpty(activeLoot?.[activeCharacterId]) ? <LootModal activeLoot={activeLoot[activeCharacterId]} /> : null}
         {activeNpc ? <NpcModal questDefinition={questDefinition} activeNpc={activeNpc} /> : null}
         <ExperienceBar />
         <PackageContext.Consumer>
            {(packageContext) => (
               <SocketContext.Consumer>
                  {(socketContext) => (
                     <ReactReduxContext.Consumer>
                        {({ store }) => (
                           <Stage width={gameSize.width} height={gameSize.height} options={{ backgroundColor: 0x000000, autoDensity: true }}>
                              <PackageContext.Provider value={packageContext}>
                                 <SocketContext.Provider value={socketContext}>
                                    <Provider store={store}>
                                       {activeCharacterId && characterMovements && (
                                          <Container
                                             position={[
                                                -(characterMovements[activeCharacterId]?.location.x ?? 0) + gameSize.width / 2,
                                                -(characterMovements[activeCharacterId]?.location.y ?? 0) + gameSize.height / 2,
                                             ]}
                                          >
                                             <MapWrapper />
                                             <AreasSpellsEffectsManager />
                                             <AreasManager />
                                             {renderSpells()}
                                             <RenderPlayersManager />
                                             <FloatingNumbersManager />
                                             <BlinkSpellEffect />
                                             <BloodPoolManager />
                                             <CastBarsManager location={characterMovements[activeCharacterId]?.location} spellChannels={spellChannels} />
                                          </Container>
                                       )}
                                       <NextLevelManager experienceEvents={experienceEvents} />
                                       <ErrorMessages errorMessages={errorMessagesEvents as ErrorMessage[]} />
                                    </Provider>
                                 </SocketContext.Provider>
                              </PackageContext.Provider>
                           </Stage>
                        )}
                     </ReactReduxContext.Consumer>
                  )}
               </SocketContext.Consumer>
            )}
         </PackageContext.Consumer>
      </>
   );
};

export default Map;
