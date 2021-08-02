import { forEach } from 'lodash';
import { Graphics } from '@inlet/react-pixi';
import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearFirstSpellLanded, selectLastSpellLandTimestamp, selectSpellShapesToDisplay } from '../../stores';
import { BlinkSpellDefinitions } from './BlinkSpellDefinitions';

export const BlinkSpellEffect = () => {
   const activeSpellsCasts = useSelector(selectSpellShapesToDisplay);
   const lastSpellLandTimestamp = useSelector(selectLastSpellLandTimestamp);
   const dispatch = useDispatch();
   console.log(activeSpellsCasts);

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
      if (lastSpellLandTimestamp) {
         setTimeout(() => {
            dispatch(clearFirstSpellLanded());
         }, 150);
      }
   }, [lastSpellLandTimestamp]);

   const drawSpellEffect = useCallback(
      (g) => {
         g.clear();
         forEach(activeSpellsCasts, (spellLandedEvent) => {
            if (BlinkSpellDefinitions[spellLandedEvent.spell.name] && typeDrawer[spellLandedEvent.spell.type]) {
               typeDrawer[spellLandedEvent.spell.type](g, spellLandedEvent);
            }
         });
      },
      [activeSpellsCasts]
   );

   return <Graphics draw={drawSpellEffect} />;
};
