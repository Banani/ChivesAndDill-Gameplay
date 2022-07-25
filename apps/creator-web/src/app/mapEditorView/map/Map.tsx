import { Stage } from '@inlet/react-pixi';
import _ from 'lodash';
import * as PIXI from 'pixi.js';
import { range } from 'lodash';
import { useCallback, useContext, useEffect, useState } from 'react';
import { MapSprite } from './mapSprite';
import { BLOCK_SIZE } from '../../consts';
import { Texture } from 'pixi.js';
import { PackageContext } from '../../contexts/packageContext';
import { MapEditorContext } from '../contexts/mapEditorContextProvider';
import { Location } from '@bananos/types';
import { Rectangle } from './shape/shape';

import styles from './map.module.scss';

export const Map = () => {
   const [texturesMap, setTexturesMap] = useState<Record<string, Texture>>({});
   const [mousePosition, setMousePosition] = useState<Location | null>(null);
   const packageContext = useContext(PackageContext);
   const mapEditorContext = useContext(MapEditorContext);

   useEffect(() => {
      const output: Record<string, Texture> = {};

      _.forEach(packageContext?.backendStore?.sprites?.data, (mapElement, key) => {
         const baseTexture = PIXI.BaseTexture.from('../../../assets/' + mapElement.spriteSheet);
         output[key] = new PIXI.Texture(baseTexture, new PIXI.Rectangle(mapElement.x * BLOCK_SIZE + 1, mapElement.y * BLOCK_SIZE + 1, 30, 30));
      });
      console.log(output);
      setTexturesMap(output);
   }, [packageContext?.backendStore?.sprites?.data]);

   const mapClick = useCallback(
      (e) => {
         if (mapEditorContext.activeSprite) {
            mapEditorContext.updateMapField({
               x: Math.floor(e.nativeEvent.offsetX / 32),
               y: Math.floor(e.nativeEvent.offsetY / 32),
               spriteId: mapEditorContext.activeSprite,
            });
         } else {
            console.log('Nie wybrano sprite');
         }
      },
      [mapEditorContext]
   );

   if (!Object.keys(texturesMap).length || !packageContext?.backendStore?.map) {
      return <></>;
   }

   return (
      <div className={styles['stage']}>
         <Stage
            width={900}
            height={600}
            options={{ backgroundColor: 0x000000, autoDensity: true }}
            onClick={mapClick}
            onMouseMove={(e) => {
               setMousePosition({
                  x: e.nativeEvent.offsetX,
                  y: e.nativeEvent.offsetY,
               });
            }}
            onMouseLeave={() => {
               setMousePosition(null);
            }}
         >
            {range(0, 100).map((x) =>
               range(0, 100)
                  .filter((y) => !!packageContext.backendStore.map.data[`${x}:${y}`])
                  .map((y) =>
                     packageContext.backendStore.map.data[`${x}:${y}`].map((spriteId: string, i: string) => (
                        <MapSprite key={`${x}:${y}:${i}`} location={{ x, y }} texture={texturesMap[spriteId]} />
                     ))
                  )
            )}
            {mousePosition && mapEditorContext.activeSprite && (
               <>
                  <Rectangle
                     color={'33aa33'}
                     location={{ x: mousePosition?.x - (mousePosition?.x % 32) - 2, y: mousePosition?.y - (mousePosition?.y % 32) - 2 }}
                     size={{ width: 36, height: 36 }}
                  />
                  <MapSprite
                     texture={texturesMap[mapEditorContext.activeSprite]}
                     location={{ x: Math.floor(mousePosition?.x / 32), y: Math.floor(mousePosition?.y / 32) }}
                  />
               </>
            )}
         </Stage>
      </div>
   );
};
