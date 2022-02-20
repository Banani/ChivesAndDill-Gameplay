import React from "react";
import { Sprite } from '@inlet/react-pixi';
import _ from 'lodash';
import * as PIXI from 'pixi.js';

export const MapField = React.memo(({ texture, spriteIndex }: { texture: any, spriteIndex: string }) => {
  const blockHeight = 32;
  const blockWidth = 32;

  return (
    <Sprite
      height={blockHeight}
      width={blockWidth}
      texture={texture}
      x={0}
      y={0}>
    </Sprite>

  )
});

