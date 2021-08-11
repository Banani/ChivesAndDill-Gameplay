import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectAreas } from '../../stores';
import { Graphics } from '@inlet/react-pixi';

export const DrawAreas = () => {
   const areas = useSelector(selectAreas);

   const drawAreas = useCallback(
      (g) => {
         areas.forEach((obstacle) => {
            g.beginFill(0xd94911);
            g.lineStyle(4, 0xcccccc, 1);
            g.drawPolygon(obstacle.flat());
            g.endFill();
         });
      },
      [areas]
   );

   const drawBorders = useCallback((g) => {
      g.clear();
      g.lineStyle(2, 0xcccccc, 1);
      g.moveTo(0, 0);
      g.lineTo(3936, 0);
      g.lineTo(3936, 4408);
      g.lineTo(0, 4408);
      g.lineTo(0, 0);
      g.endFill();
   }, []);

   return (
      <>
         {areas.length ? <Graphics draw={drawAreas} /> : null}
         <Graphics draw={drawBorders} />
      </>
   );
};
