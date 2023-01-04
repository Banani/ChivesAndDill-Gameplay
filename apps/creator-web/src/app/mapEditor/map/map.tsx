import { Location } from '@bananos/types';
import { Stage } from '@inlet/react-pixi';
import _, { range } from 'lodash';
import * as PIXI from 'pixi.js';
import { Texture } from 'pixi.js';
import { useCallback, useContext, useEffect, useState } from 'react';
import { BLOCK_SIZE } from '../../consts';
import { PackageContext } from '../../contexts/packageContext';
import { MapActionsList, MapEditorContext } from '../contexts/mapEditorContextProvider';
import { MapSprite } from './mapSprite/mapSprite';
import { Rectangle } from './shape/shape';

import styles from './map.module.scss';

export const Map = () => {
   const [texturesMap, setTexturesMap] = useState<Record<string, Texture>>({});
   const [mousePosition, setMousePosition] = useState<Location | null>(null);
   const packageContext = useContext(PackageContext);
   const mapEditorContext = useContext(MapEditorContext);

   const actionModes: Partial<Record<MapActionsList, any>> = {
      [MapActionsList.Edit]: {
         onClick: (e: any) => {
            if (mapEditorContext?.activeSprite) {
               mapEditorContext.updateMapField({
                  x: Math.floor(e.nativeEvent.offsetX / 32),
                  y: Math.floor(e.nativeEvent.offsetY / 32),
                  spriteId: mapEditorContext.activeSprite,
               });
            } else {
               console.log('Nie wybrano sprite');
            }
         },
      },
      [MapActionsList.Delete]: {
         onClick: (e: any) => {
            mapEditorContext.deleteMapField({
               x: Math.floor(e.nativeEvent.offsetX / 32),
               y: Math.floor(e.nativeEvent.offsetY / 32),
            });
         },
      },
   };

   useEffect(() => {
      const output: Record<string, Texture> = {};

      _.forEach(packageContext?.backendStore?.sprites?.data, (mapElement, key) => {
         const baseTexture = PIXI.BaseTexture.from('../../../assets/' + mapElement.spriteSheet);
         output[key] = new PIXI.Texture(baseTexture, new PIXI.Rectangle(mapElement.x * BLOCK_SIZE + 1, mapElement.y * BLOCK_SIZE + 1, 30, 30));
      });

      setTexturesMap(output);
   }, [packageContext?.backendStore?.sprites?.data]);

   const mapClick = useCallback(
      (e) => {
         if (mapEditorContext && actionModes[mapEditorContext.currentMapAction] && actionModes[mapEditorContext.currentMapAction].onClick) {
            actionModes[mapEditorContext.currentMapAction].onClick(e);
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
                  .map((y) => (
                     <MapSprite key={`${x}:${y}`} location={{ x, y }} texture={texturesMap[packageContext.backendStore.map.data[`${x}:${y}`].spriteId]} />
                  ))
            )}
            {mousePosition && mapEditorContext?.activeSprite && mapEditorContext.currentMapAction === MapActionsList.Edit && (
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

            {mousePosition && mapEditorContext.currentMapAction === MapActionsList.Delete && (
               <>
                  <Rectangle
                     color={'aa3333'}
                     location={{ x: mousePosition?.x - (mousePosition?.x % 32) - 2, y: mousePosition?.y - (mousePosition?.y % 32) - 2 }}
                     size={{ width: 36, height: 36 }}
                  />
               </>
            )}
         </Stage>
      </div>
   );
};
