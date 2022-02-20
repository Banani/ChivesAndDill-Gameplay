import React, { useEffect, useState } from 'react';
import { selectMapSchema } from '../../../stores';
import { MapField } from './MapField';
import * as PIXI from 'pixi.js';
import { useSelector } from 'react-redux';
import _ from 'lodash';

export const MapManager = () => {

  const [texturesMap, setTexturesMap] = useState({});
  const mapSchema = useSelector(selectMapSchema);

  useEffect(() => {
    const baseTexture = PIXI.BaseTexture.from(mapSchema.mapSchema['1'].path);

    const output = {};
    _.forEach(mapSchema.mapSchema, (mapElement, key) => {
      output[key] = new PIXI.Texture(
        baseTexture,
        new PIXI.Rectangle(mapElement.location.x, mapElement.location.y, 32, 32)
      );
    });

    setTexturesMap(output);

  }, [])

  useEffect(() => {
    console.log(texturesMap);
  }, [texturesMap])

  return Object.keys(texturesMap).length ? mapSchema.mapDefinition.map((item, i) => <MapField
    texture={texturesMap[item.s]}
    spriteIndex={item.s}
    key={i}
  />) : <></>
}