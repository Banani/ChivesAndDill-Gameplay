import React, { useCallback } from 'react';
import _ from 'lodash';
import { Graphics } from '@inlet/react-pixi';

export const Obstacle = React.memo(({ coords }: { coords: number[] }) => {
   const drawObstacle = useCallback(
      (g) => {
         g.beginFill(0xd94911);
         g.lineStyle(4, 0xcccccc, 1);
         g.drawPolygon(coords.flat());
         g.endFill();
      },
      [coords]
   );

   return <Graphics draw={drawObstacle} />;
}, _.isEqual);
