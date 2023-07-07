import { BLOCK_SIZE, BOTTOM_UP_BLOCKS_AMOUNT, SIDE_BLOCKS_AMOUNT } from 'apps/chives-and-dill/src/consts/consts';
import _ from 'lodash';
import * as PIXI from 'pixi.js';
import React, { useEffect, useState } from 'react';
import { MapField } from './MapField';

export const MapManager = React.memo<{ mapSchema: any; location: { x: number; y: number }, lastUpdateTime: string }>(
    ({ mapSchema, location }) => {
        const [texturesMap, setTexturesMap] = useState({});

        useEffect(() => {
            const output = {};

            _.forEach(mapSchema.mapSchema, (mapElement, key) => {
                const baseTexture = PIXI.BaseTexture.from(mapElement.path);
                output[key] = new PIXI.Texture(baseTexture, new PIXI.Rectangle(mapElement.location.x + 1, mapElement.location.y + 1, 30, 30));
            });

            setTexturesMap(output);
        }, [mapSchema.mapSchema]);

        if (!Object.keys(texturesMap).length) {
            return <></>;
        }

        return (
            <>
                {_.range(Math.round(location.x / BLOCK_SIZE) - SIDE_BLOCKS_AMOUNT, Math.round(location.x / BLOCK_SIZE) + SIDE_BLOCKS_AMOUNT)
                    .map((x) =>
                        _.range(Math.round(location.y / BLOCK_SIZE) - BOTTOM_UP_BLOCKS_AMOUNT, Math.round(location.y / BLOCK_SIZE) + BOTTOM_UP_BLOCKS_AMOUNT).map(
                            (y) => {
                                const sprites = mapSchema.mapDefinition[`${x}:${y}`];
                                if (!sprites) {
                                    return <></>;
                                }

                                return sprites.map((sprite, i) => (
                                    <MapField texture={texturesMap[sprite]} spriteIndex={sprite} location={{ x, y }} key={`${x}:${y}:${i}`} />
                                ));
                            }
                        )
                    )
                    .flat()}
            </>
        );
    },
    (old, newProps) =>
        Math.round(old.location.x / BLOCK_SIZE) === Math.round(newProps.location.x / BLOCK_SIZE) &&
        Math.round(old.location.y / BLOCK_SIZE) === Math.round(newProps.location.y / BLOCK_SIZE) &&
        old.lastUpdateTime === newProps.lastUpdateTime
);
