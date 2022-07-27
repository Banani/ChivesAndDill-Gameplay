import { Graphics } from '@inlet/react-pixi';
import { Location } from 'libs/types/src/common/Location';
import { useCallback } from 'react';
import { FunctionComponent } from 'react';

interface ShapeProps {
   location: Location;
   size: {
      width: number;
      height: number;
   };
   color: string;
}

export const Rectangle: FunctionComponent<ShapeProps> = ({ location, color, size }) => {
   const draw = useCallback(
      (g) => {
         g.clear();
         g.beginFill('0x' + color, 1);
         g.drawRect(location.x, location.y, size.width, size.height);
      },
      [location, size]
   );

   return <Graphics draw={draw} />;
};
