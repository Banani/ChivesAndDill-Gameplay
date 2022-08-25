import { EngineEventType, EnginePackageEvent, GlobalStoreModule } from '@bananos/types';
import { Graphics, Text } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';
import React, { useCallback, useEffect, useState } from 'react';
import { useEngineModuleReader, useMessageCenter } from '../../hooks';

export const NextLevelManager = React.memo<{ experienceEvents: EnginePackageEvent[] }>(
   ({ experienceEvents }) => {
      const [characterLevel, setCharacterLevel] = useState(0);
      const [characterId, setCharacterId] = useState('');
      const { activeCharacterId } = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER).data;
      const { messageLocation } = useMessageCenter();

      useEffect(() => {
         experienceEvents.forEach((event) => {
            if (event.type === EngineEventType.LevelChanged) {
               if (event.level > characterLevel) {
                  setCharacterLevel(event.level);
                  setCharacterId(event.characterId);
               }
            }
         });
      }, [experienceEvents, characterLevel]);

      useEffect(() => {
         setTimeout(() => {
            setCharacterLevel(0);
         }, 3000);
      }, [characterLevel]);

      const drawLines = useCallback(
         (g) => {
            g.clear();
            g.lineStyle(1, 0xfac20a, 1);
            g.moveTo(messageLocation.x - 200, messageLocation.y - 80);
            g.lineTo(messageLocation.x + 200, messageLocation.y - 80);

            g.moveTo(messageLocation.x - 200, messageLocation.y + 80);
            g.lineTo(messageLocation.x + 200, messageLocation.y + 80);
         },
         [messageLocation]
      );

      return characterLevel && characterId === activeCharacterId ? (
         <>
            <Graphics draw={drawLines} />
            <Text
               anchor={0.5}
               text={"You've Reached"}
               x={messageLocation.x}
               y={messageLocation.y - 25}
               style={
                  new PIXI.TextStyle({
                     fontSize: 30,
                     fill: '#e8e8e8',
                     stroke: '#000000',
                     strokeThickness: 2,
                     dropShadow: true,
                     dropShadowColor: '#363837',
                     dropShadowBlur: 4,
                     dropShadowAngle: Math.PI / 6,
                     dropShadowDistance: 6,
                  })
               }
            />

            <Text
               anchor={0.5}
               text={`Level ${characterLevel}`}
               x={messageLocation.x}
               y={messageLocation.y + 25}
               style={
                  new PIXI.TextStyle({
                     fontSize: 40,
                     fill: '#fac20a',
                     stroke: '#000000',
                     strokeThickness: 3,
                     dropShadow: true,
                     dropShadowColor: '#363837',
                     dropShadowBlur: 6,
                     dropShadowAngle: Math.PI / 6,
                     dropShadowDistance: 3,
                  })
               }
            />
         </>
      ) : null;
   },
   (old, newProps) => old.experienceEvents.length === newProps.experienceEvents.length
);
