import React from 'react';
import { Sprite } from '@inlet/react-pixi';
import _ from 'lodash';

export const MapField = React.memo(
   ({ texture, spriteIndex, location }: { texture: any; spriteIndex: string; location: any }) => {
      const blockHeight = 64;
      const blockWidth = 64;

      return <Sprite height={blockHeight} width={blockWidth} texture={texture} x={location.x * 64} y={location.y * 64}></Sprite>;
   },
   (a, b) => a.spriteIndex === a.spriteIndex
);
