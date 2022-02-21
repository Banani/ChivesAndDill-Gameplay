import React, { useEffect, useState } from 'react';
import { MapField } from './MapField';
import * as PIXI from 'pixi.js';
import _ from 'lodash';

export const MapManager = React.memo(
  ({ mapSchema }: { mapSchema: any }) => {
    const [texturesMap, setTexturesMap] = useState({});

    useEffect(() => {
      const output = {};
      _.forEach(mapSchema.mapSchema, (mapElement, key) => {
        const baseTexture = PIXI.BaseTexture.from(mapElement.path);
        output[key] = new PIXI.Texture(baseTexture, new PIXI.Rectangle(mapElement.location.x, mapElement.location.y, 32, 32));
      });

      setTexturesMap(output);
    }, []);

    return Object.keys(texturesMap).length ? (
      mapSchema.mapDefinition.map((item, i) => <MapField texture={texturesMap[item.s]} spriteIndex={item.s} location={{ x: item.x, y: item.y }} key={i} />)
    ) : (
      <></>
    );
  },
  (old, newProps) =>
    old.mapSchema.mapDefinition.length === newProps.mapSchema.mapDefinition.length &&
    Object.keys(old.mapSchema.mapSchema).length === Object.keys(newProps.mapSchema.mapSchema).length
);
