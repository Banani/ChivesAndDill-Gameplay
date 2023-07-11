import { GlobalStoreModule } from '@bananos/types';
import { Text } from '@inlet/react-pixi';
import { filter, map } from 'lodash';
import * as PIXI from 'pixi.js';
import React, { useEffect, useState } from 'react';
import { useEngineModuleReader } from '../../hooks';

export const DialogsManager = () => {
   const [activeShapes, setActiveShapes] = useState([]);
   const { recentData: chatMessages } = useEngineModuleReader(GlobalStoreModule.CHAT_MESSAGES);
   const { data: charactersMovements } = useEngineModuleReader(GlobalStoreModule.CHARACTER_MOVEMENTS);
   const { data: characters } = useEngineModuleReader(GlobalStoreModule.CHARACTER);

   useEffect(() => {
      const interval = setInterval(() => {
         setActiveShapes((prev) => filter(prev, (shape) => Date.now() - shape.creationTime < 3000));
      }, 20);

      return () => clearInterval(interval);
   }, []);

   useEffect(() => {
      setActiveShapes((prev) => [
         ...prev,
         ...map(chatMessages, (event) => ({ creationTime: Date.now(), event, location: charactersMovements[event.authorId].location })),
      ]);
   }, [chatMessages]);

   const getColorByCharacterType = (type) => {
      if (type === 'Npc') {
         return '#e5e4e0';
      } else if (type === 'Monster') {
         return '#ea5c19';
      }

      return '#e5e4e0';
   };

   const getDialogStyles = (event) =>
      new PIXI.TextStyle({
         fontSize: 18,
         fill: getColorByCharacterType(characters[event.authorId].type),
         stroke: '#000000',
         fontWeight: 'bold',
         lineJoin: 'round',
         strokeThickness: 4,
         wordWrap: true,
         wordWrapWidth: 200,
         align: 'center',
      });

   return (
      <>
         {map(activeShapes, ({ event, location }, i) => (
            <>
               <Text
                  anchor={[0.5, 0]}
                  text={characters[event.authorId].name + ':'}
                  x={location.x}
                  y={location.y - characters[event.authorId].size / 1.5 - 20}
                  style={getDialogStyles(event)}
               />
               <Text
                  anchor={[0.5, 0]}
                  text={event.message}
                  x={location.x}
                  y={location.y - characters[event.authorId].size / 1.5}
                  style={getDialogStyles(event)}
               />
            </>
         ))}
      </>
   );
};
