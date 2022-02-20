import React from 'react';
import { Sprite } from '@inlet/react-pixi';
import _ from 'lodash';

export const MapField = React.memo(
   ({ texture, spriteIndex, location }: { texture: any; spriteIndex: string; location: any }) => {
      const blockHeight = 32;
      const blockWidth = 32;

      return <Sprite height={blockHeight} width={blockWidth} texture={texture} x={location.x * 32} y={location.y * 32}></Sprite>;
   },
   (a, b) => a.spriteIndex === a.spriteIndex
);
