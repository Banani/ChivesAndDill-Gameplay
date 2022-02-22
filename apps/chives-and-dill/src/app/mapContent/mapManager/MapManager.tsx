import React, { useEffect, useState } from 'react';
import { MapField } from './MapField';
import * as PIXI from 'pixi.js';
import _ from 'lodash';

const BLOCK_SIZE = 64;
const SIDE_BLOCKS_AMOUNT = 20;
const BOTTOM_UP_BLOCKS_AMOUNT = 12;

export const MapManager = React.memo(
   ({ mapSchema, location }: { mapSchema: any; location: { x: number; y: number } }) => {
      const [texturesMap, setTexturesMap] = useState({});

      useEffect(() => {
         const baseTexture = PIXI.BaseTexture.from(mapSchema.mapSchema['1'].path);

         const output = {};
         _.forEach(mapSchema.mapSchema, (mapElement, key) => {
            output[key] = new PIXI.Texture(baseTexture, new PIXI.Rectangle(mapElement.location.x + 1, mapElement.location.y + 1, 30, 30));
         });

         setTexturesMap(output);
      }, []);

      if (!Object.keys(texturesMap).length) {
         return <></>;
      }

      return _.range(Math.round(location.x / BLOCK_SIZE) - SIDE_BLOCKS_AMOUNT, Math.round(location.x / BLOCK_SIZE) + SIDE_BLOCKS_AMOUNT)
         .map((x) => {
            return _.range(Math.round(location.y / BLOCK_SIZE) - BOTTOM_UP_BLOCKS_AMOUNT, Math.round(location.y / BLOCK_SIZE) + BOTTOM_UP_BLOCKS_AMOUNT).map(
               (y) => {
                  const sprites = mapSchema.mapDefinition[`${x}:${y}`];
                  if (!sprites) {
                     return <></>;
                  }

                  return sprites.map((sprite) => <MapField texture={texturesMap[sprite]} spriteIndex={sprite} location={{ x, y }} key={`${x}:${y}`} />);
               }
            );
         })
         .flat();
   },
   (old, newProps) => Math.round(old.location / BLOCK_SIZE) === Math.round(newProps.location / BLOCK_SIZE)
);
