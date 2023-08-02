import { Sprite } from '@inlet/react-pixi';
import { BLOCK_SIZE } from 'apps/chives-and-dill/src/consts/consts';
import React from 'react';

export const MapField = React.memo(
    ({ texture, spriteIndex, location }: { texture: any; spriteIndex: string; location: any }) => (
        <Sprite height={BLOCK_SIZE + 2} width={BLOCK_SIZE} texture={texture} x={location.x * BLOCK_SIZE} y={location.y * BLOCK_SIZE}></Sprite>
    ),
    (a, b) => a.spriteIndex === b.spriteIndex
);