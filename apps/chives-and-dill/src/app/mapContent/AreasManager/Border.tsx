import React, { useCallback } from 'react';
import { Graphics } from '@inlet/react-pixi';

export const Border = React.memo(() => {
   const drawBorder = useCallback((g) => {
      g.clear();
      g.lineStyle(2, 0xcccccc, 1);
      g.moveTo(0, 0);
      g.lineTo(3936, 0);
      g.lineTo(3936, 4408);
      g.lineTo(0, 4408);
      g.lineTo(0, 0);
      g.endFill();
   }, []);

   return <Graphics draw={drawBorder} />;
});
