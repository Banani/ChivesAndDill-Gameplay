import { Text } from '@inlet/react-pixi';
import { filter, map } from 'lodash';
import * as PIXI from 'pixi.js';
import React, { useEffect, useState } from 'react';
import { useEngineModuleReader } from '../../hooks';
import { GlobalStoreModule } from '@bananos/types';

export const DialogsManager = () => {

   const [activeShapes, setActiveShapes] = useState([]);
   const { recentData: chatMessages } = useEngineModuleReader(GlobalStoreModule.CHAT_MESSAGES);
   const { data: characters } = useEngineModuleReader(GlobalStoreModule.CHARACTER);

   useEffect(() => {
      const interval = setInterval(() => {
         setActiveShapes((prev) => filter(prev, (shape) => Date.now() - shape.creationTime < 3000));
      }, 20);

      return () => clearInterval(interval);
   }, []);

   useEffect(() => {
      setActiveShapes((prev) => [...prev, ...map(chatMessages, (event) => ({ creationTime: Date.now(), event }))]);
   }, [chatMessages]);

   return (
      <>
         {map(activeShapes, ({ event }, i) => (
            <>
               <Text
                  anchor={[0.5, 0]}
                  text={characters[event.authorId].name + ':'}
                  x={characters[event.authorId].location.x}
                  y={characters[event.authorId].location.y - (characters[event.authorId].size / 1.5) - 20}
                  style={
                     new PIXI.TextStyle({
                        fontSize: 18,
                        fill: '#e5e4e0',
                        stroke: '#000000',
                        strokeThickness: 3,
                        wordWrap: true,
                        wordWrapWidth: 200,
                        align: 'center',
                     })
                  }
               />
               <Text
                  anchor={[0.5, 0]}
                  text={event.message}
                  x={characters[event.authorId].location.x}
                  y={characters[event.authorId].location.y - characters[event.authorId].size / 1.5}
                  style={
                     new PIXI.TextStyle({
                        fontSize: 18,
                        fill: '#e5e4e0',
                        stroke: '#000000',
                        strokeThickness: 3,
                        wordWrap: true,
                        wordWrapWidth: 200,
                        align: 'center',
                     })
                  }
               />
            </>
         ))}
      </>
   );
}
