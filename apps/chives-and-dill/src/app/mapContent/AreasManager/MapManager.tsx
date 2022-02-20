import React, { useCallback } from 'react';
import { mapDefinition } from '../../../../../engine/src/app/modules/MapModule/mapDefinition';
import { mapSchema } from '../../../../../engine/src/app/modules/MapModule/mapSchema';
import { Sprite } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';

export const MapManager = () => {

  const blockHeight = 32;
  const blockWidth = 32;

  const renderTerrain = useCallback(
    () =>
      mapDefinition.map((item, i) => {
        const newPlayerSheets = new PIXI.Texture(
          PIXI.BaseTexture.from(mapSchema[item.s].path),
          new PIXI.Rectangle(mapSchema[item.s].location.x, mapSchema[item.s].location.y, blockWidth, blockHeight)
        );

        return <Sprite key={i} height={blockHeight} width={blockWidth} texture={newPlayerSheets} x={item.x * blockWidth} y={item.y * blockHeight}></Sprite>
      }),
    []
  );


  return <>{renderTerrain()}</>
}