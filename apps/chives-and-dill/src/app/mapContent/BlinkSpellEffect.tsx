import { filter, forEach, map } from 'lodash';
import { Graphics } from '@inlet/react-pixi';
import React, { useEffect, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { getEngineState } from '../../stores';
import { BlinkSpellDefinitions } from './BlinkSpellDefinitions';
import type { SpellLandedEvent } from '@bananos/types';
import { EngineEventType } from '@bananos/types';

export const BlinkSpellEffect = () => {
   const engineState = useSelector(getEngineState);
   const events = engineState.spells.events;
   const [activeShapes, setActiveShapes] = useState([]);

   const angleBlastDrawer = (g, spellLandedEvent) => {
      const spellDefintion = BlinkSpellDefinitions[spellLandedEvent.spell.name];
      const revertedAngle = spellLandedEvent.angle + Math.PI;
      const angle = (2 * Math.PI - revertedAngle + Math.PI) % (Math.PI * 2);

      g.beginFill(spellDefintion.color, spellDefintion.alpha);
      g.arc(
         spellLandedEvent.castLocation.x,
         spellLandedEvent.castLocation.y,
         spellLandedEvent.spell.range,
         angle - spellLandedEvent.spell.angle / 2,
         angle + spellLandedEvent.spell.angle / 2
      );
      g.lineTo(spellLandedEvent.castLocation.x, spellLandedEvent.castLocation.y);
      g.endFill();
   };

   const typeDrawer = {
      AngleBlast: angleBlastDrawer,
   };

   useEffect(() => {
      const interval = setInterval(() => {
         setActiveShapes((prev) => filter(prev, (shape) => Date.now() - shape.creationTime < 100));
      }, 20);

      return () => clearInterval(interval);
   }, []);

   useEffect(() => {
      setActiveShapes((prev) => [...prev, ...map(events, (event) => ({ creationTime: Date.now(), event }))]);
   }, [events]);

   const drawSpellEffect = useCallback(
      (g) => {
         g.clear();
         const spellLanded = map(
            filter(activeShapes, (shape) => shape.event.type === EngineEventType.SpellLanded),
            (shape) => shape.event
         ) as SpellLandedEvent[];

         forEach(spellLanded, (spellLandedEvent) => {
            const definition = BlinkSpellDefinitions[spellLandedEvent.spell.name];
            if (definition && typeDrawer[definition.type]) {
               typeDrawer[definition.type](g, spellLandedEvent);
            }
         });
      },
      [events]
   );

   return <Graphics draw={drawSpellEffect} />;
};
