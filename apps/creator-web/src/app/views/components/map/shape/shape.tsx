import { Location } from '@bananos/types';
import { Graphics } from '@inlet/react-pixi';
import { FunctionComponent, useCallback } from 'react';

interface ShapeProps {
    location: Location;
    size: {
        width: number;
        height: number;
    };
    color: string;
    opacity?: number;
}

export const Rectangle: FunctionComponent<ShapeProps> = ({ location, color, size, opacity = 1 }) => {
    const draw = useCallback(
        (g) => {
            g.clear();
            g.beginFill('0x' + color, opacity);
            g.drawRect(location.x, location.y, size.width, size.height);
        },
        [location, size]
    );

    return <Graphics draw={draw} />;
};
