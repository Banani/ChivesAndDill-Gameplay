import React from 'react';
import { Sprite } from '@inlet/react-pixi';
import _ from 'lodash';
import { sizeOfField } from '../../../consts/consts';

export const MapField = React.memo(
   ({ texture, spriteIndex, location }: { texture: any; spriteIndex: string; location: any }) => <Sprite height={sizeOfField} width={sizeOfField} texture={texture} x={location.x * sizeOfField} y={location.y * sizeOfField}></Sprite>,
   (a, b) => a.spriteIndex === a.spriteIndex
);
