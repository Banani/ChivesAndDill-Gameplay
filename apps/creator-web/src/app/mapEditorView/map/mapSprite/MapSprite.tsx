import { Sprite } from '@inlet/react-pixi';
import { Location } from 'libs/types/src/common/Location';
import React from 'react';
import { FunctionComponent } from 'react';
import { BLOCK_SIZE } from '../../../consts';

interface MapSpriteProps {
   location: Location;
   texture: any;
}

export const MapSprite: FunctionComponent<MapSpriteProps> = ({ location, texture }) => {
   return <Sprite height={BLOCK_SIZE} width={BLOCK_SIZE} texture={texture} x={location.x * BLOCK_SIZE} y={location.y * BLOCK_SIZE} />;
};
