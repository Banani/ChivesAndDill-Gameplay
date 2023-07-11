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
                output[key] = new PIXI.Texture(baseTexture, new PIXI.Rectangle(mapElement.location.x, mapElement.location.y, 32, 32));
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
                                const sprite = mapSchema.mapDefinition[`${x}:${y}`];
                                if (!sprite) {
                                    return <React.Fragment key={`${x}:${y}`}></React.Fragment>;
                                }

                                return <React.Fragment key={`${x}:${y}`}>
                                    {sprite.bottomSpriteId && <MapField texture={texturesMap[sprite.bottomSpriteId]} spriteIndex={sprite.bottomSpriteId} location={{ x, y }} />}
                                    {sprite.upperSpriteId && <MapField texture={texturesMap[sprite.upperSpriteId]} spriteIndex={sprite.upperSpriteId} location={{ x, y }} />}
                                </React.Fragment>
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
