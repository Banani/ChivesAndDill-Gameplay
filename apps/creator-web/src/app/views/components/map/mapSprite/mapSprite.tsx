import { Location } from '@bananos/types';
import { Sprite } from '@inlet/react-pixi';
import { FunctionComponent } from 'react';
import { BLOCK_SIZE } from '../../../../consts';

interface MapSpriteProps {
    location: Location;
    texture: any;
}

export const MapSprite: FunctionComponent<MapSpriteProps> = ({ location, texture }) => {
    return <Sprite height={BLOCK_SIZE} width={BLOCK_SIZE} texture={texture} x={location.x * BLOCK_SIZE} y={location.y * BLOCK_SIZE} />;
};
