import React from 'react';
import { Sprite } from '@inlet/react-pixi';
import _ from 'lodash';
import { BLOCK_SIZE } from 'apps/chives-and-dill/src/consts/consts';

export const MapField = React.memo(
   ({ texture, spriteIndex, location }: { texture: any; spriteIndex: string; location: any }) => (
      <Sprite height={BLOCK_SIZE} width={BLOCK_SIZE} texture={texture} x={location.x * BLOCK_SIZE} y={location.y * BLOCK_SIZE}></Sprite>
   ),
   (a, b) => a.spriteIndex === b.spriteIndex
);
