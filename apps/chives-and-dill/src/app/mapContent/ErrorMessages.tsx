import { EngineEventType, ErrorMessage } from '@bananos/types';
import { Text } from '@inlet/react-pixi';
import { chain, filter, map } from 'lodash';
import * as PIXI from 'pixi.js';
import React, { useEffect, useState } from 'react';
import { useMessageCenter } from '../../hooks';

export const ErrorMessages = React.memo(
   ({ errorMessages }: { errorMessages: ErrorMessage[] }) => {
      const [activeShapes, setActiveShapes] = useState([]);
      const { messageLocation } = useMessageCenter();

      useEffect(() => {
         setActiveShapes((prev) => [
            ...chain(errorMessages)
               .filter((event) => event.type === EngineEventType.ErrorMessage)
               .map((event: ErrorMessage) => ({
                  id: Date.now(),
                  event: {
                     type: event.type,
                     message: event.message,
                  },
               }))
               .forEach((message) => {
                  setTimeout(() => {
                     setActiveShapes((prev) => filter(prev, (currentMessage) => message.id !== currentMessage.id));
                  }, 2000);
               })
               .value(),
            ...prev,
         ]);
      }, [errorMessages]);

      useEffect(() => {
         if (activeShapes.length > 3) {
            setActiveShapes(activeShapes.slice(0, 3));
         }
      }, [activeShapes]);

      return (
         <>
            {map(activeShapes, ({ event }, i) => (
               <Text
                  anchor={[0.5, 0]}
                  text={event.message}
                  x={messageLocation.x}
                  y={messageLocation.y + i * 22}
                  style={
                     new PIXI.TextStyle({
                        fontSize: 22,
                        fill: '#8f0303',
                        stroke: '#000000',
                        strokeThickness: 2,
                     })
                  }
               />
            ))}
         </>
      );
   },
   (oldProps, newProps) => oldProps.errorMessages?.length === newProps.errorMessages?.length
);
