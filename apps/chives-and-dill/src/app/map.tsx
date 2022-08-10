import { AppContext, Container, Sprite, Stage } from '@inlet/react-pixi';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { Provider, ReactReduxContext, useSelector } from 'react-redux';
import { getCharactersMovements, getCurrency, getEngineState, selectActiveCharacterId, selectMapSchema, selectSpellChannels, getActiveConversation, getActiveLoot } from '../stores';
import { SocketContext } from './gameController/socketContext';

import { ActivePlayerTimeEffects } from './guiContent/activePlayerTimeEffects/ActivePlayerTimeEffects';
import { CharacterFrames } from './guiContent/characterFrames/CharacterFrames';
import { Chat } from './guiContent/chat/Chat';
import { ExperienceBar } from './guiContent/experienceBar/ExperienceBar';
import { MoneyBar } from './guiContent/moneyBar/MoneyBar';
import { QuestLog } from './guiContent/quests/questLog/QuestLog';
import { QuestsSideView } from './guiContent/quests/questSideView/QuestsSideView';
import { SpellsBar } from './guiContent/spellsBar/SpellsBar';
import { NpcModal } from './guiContent/npcModal/NpcModal';
import { LootModal } from './guiContent/lootModal/LootModal';
import { AreasManager } from './mapContent/AreasManager';
import { AreasSpellsEffectsManager } from './mapContent/AreasSpellsEffectsManager';
import { BlinkSpellEffect } from './mapContent/BlinkSpellEffect';
import { BloodPoolManager } from './mapContent/BloodPoolsManager';
import { CastBarsManager } from './mapContent/CastBarsManager';
import { ErrorMessages } from './mapContent/ErrorMessages';
import { FloatingNumbersManager } from './mapContent/FloatingNumbersManager';
import { MapManager } from './mapContent/mapManager/MapManager';
import { NextLevelManager } from './mapContent/NextLevelManager';
import { RenderPlayersManager } from './mapContent/RenderPlayersManager';

const Map = () => {
   const activePlayerId = useSelector(selectActiveCharacterId);
   const engineState = useSelector(getEngineState);
   const mapSchema = useSelector(selectMapSchema);
   const spellChannels = useSelector(selectSpellChannels);
   const charactersMovements = useSelector(getCharactersMovements);
   const activeLoot = useSelector(getActiveLoot);
   const currency = useSelector(getCurrency);
   const activeConversation = useSelector(getActiveConversation);
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
         {!_.isEmpty(activeLoot[activePlayerId]) ? <LootModal activeLoot={activeLoot[activePlayerId]} /> : null}
         {activeConversation ? <NpcModal /> : null}
         <MoneyBar currency={currency} activePlayerId={activePlayerId} />
         <ExperienceBar />
         <SocketContext.Consumer>
            {(socketContext) => (
               <ReactReduxContext.Consumer>
                  {({ store }) => (
                     <Stage width={gameSize.width} height={gameSize.height} options={{ backgroundColor: 0x000000, autoDensity: true }}>
                        <AppContext.Consumer>
                           {(app) => (
                              <SocketContext.Provider value={socketContext}>
                                 <Provider store={store}>
                                    {activePlayerId && engineState.characterMovements && (
                                       <Container
                                          position={[
                                             -(charactersMovements[activePlayerId]?.location.x ?? 0) + gameSize.width / 2,
                                             -(charactersMovements[activePlayerId]?.location.y ?? 0) + gameSize.height / 2,
                                          ]}
                                       >
                                          <MapManager mapSchema={mapSchema} location={charactersMovements[activePlayerId]?.location} />
                                          <AreasSpellsEffectsManager />
                                          <AreasManager />
                                          {renderSpells()}
                                          <RenderPlayersManager />
                                          <FloatingNumbersManager />
                                          <BlinkSpellEffect />
                                          <BloodPoolManager />
                                          <CastBarsManager location={charactersMovements[activePlayerId]?.location} spellChannels={spellChannels} />
                                          <ErrorMessages />
                                       </Container>
                                    )}
                                    <NextLevelManager experienceEvents={engineState.experience.events} />
                                 </Provider>
                              </SocketContext.Provider>
                           )}
                        </AppContext.Consumer>
                     </Stage>
                  )}
               </ReactReduxContext.Consumer>
            )}
         </SocketContext.Consumer>
      </>
   );
};

export default Map;
