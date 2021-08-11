import { filter, forEach } from 'lodash';
import { Graphics } from '@inlet/react-pixi';
import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearEvent, getEngineSpellsEvents } from '../../stores';
import { BlinkSpellDefinitions } from './BlinkSpellDefinitions';
import { EngineEventType, GlobalStoreModule } from '@bananos/types';

export const BlinkSpellEffect = () => {
   const events = useSelector(getEngineSpellsEvents);

   const dispatch = useDispatch();

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
      if (Object.keys(events).length > 0) {
         // TODO: Usunac jak juz nie bedzie nie potrzebnych rerenderow
         setTimeout(() => {
            dispatch(clearEvent({ module: GlobalStoreModule.SPELLS, eventId: Object.keys(events).pop() }));
         }, 150);
      }
   }, [events]);

   const drawSpellEffect = useCallback(
      (g) => {
         g.clear();
         const spellLanded = filter(events, (event) => event.type === EngineEventType.SpellLanded);

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
