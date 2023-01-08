import { Location } from '@bananos/types';
import { Stage } from '@inlet/react-pixi';
import _, { range, throttle } from 'lodash';
import * as PIXI from 'pixi.js';
import { Texture } from 'pixi.js';
import { useCallback, useContext, useEffect, useState } from 'react';
import { BLOCK_SIZE } from '../../consts';
import { PackageContext } from '../../contexts/packageContext';
import { BrushSize, MapActionsList, MapEditorContext } from '../contexts/mapEditorContextProvider';
import { MapSprite } from './mapSprite/mapSprite';
import { Rectangle } from './shape/shape';

import styles from './map.module.scss';

const BrushSizeToPlatesAmount = {
   [BrushSize.Small]: 1,
   [BrushSize.Medium]: 3,
   [BrushSize.Big]: 9,
};

export const Map = () => {
   const [texturesMap, setTexturesMap] = useState<Record<string, Texture>>({});
   const [mousePosition, setMousePosition] = useState<Location | null>(null);
   const packageContext = useContext(PackageContext);
   const mapEditorContext = useContext(MapEditorContext);
   const [stage, setStage] = useState<null | HTMLDivElement>(null);

   const actionModes: Partial<Record<MapActionsList, any>> = {
      [MapActionsList.Edit]: {
         onClick: (e: any) => {
            if (mapEditorContext?.activeSprite) {
               mapEditorContext.updateMapField({
                  brushSize: BrushSizeToPlatesAmount[mapEditorContext.brushSize],
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
               brushSize: BrushSizeToPlatesAmount[mapEditorContext.brushSize],
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

   const onMouseMove = throttle((e) => {
      setMousePosition({
         x: e.nativeEvent.offsetX,
         y: e.nativeEvent.offsetY,
      });
   }, 100);

   if (!Object.keys(texturesMap).length || !packageContext?.backendStore?.map) {
      return <></>;
   }

   const offset = (BrushSizeToPlatesAmount[mapEditorContext.brushSize] - 1) / 2;

   return (
      <div className={styles['stage']} ref={(newRef) => setStage(newRef)}>
         <Stage
            width={stage?.clientWidth ?? 900}
            height={(stage?.clientHeight ?? 600) - 10}
            options={{ backgroundColor: 0x000000, autoDensity: true }}
            onClick={mapClick}
            onMouseMove={onMouseMove}
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
                     location={{
                        x: mousePosition?.x - (mousePosition?.x % 32) - ((BrushSizeToPlatesAmount[mapEditorContext.brushSize] - 1) / 2) * 32 - 3,
                        y: mousePosition?.y - (mousePosition?.y % 32) - ((BrushSizeToPlatesAmount[mapEditorContext.brushSize] - 1) / 2) * 32 - 3,
                     }}
                     size={{
                        width: BrushSizeToPlatesAmount[mapEditorContext.brushSize] * 32 + 6,
                        height: BrushSizeToPlatesAmount[mapEditorContext.brushSize] * 32 + 6,
                     }}
                  />

                  {range(-offset, offset + 1).map((x) => {
                     {
                        return range(-offset, offset + 1).map((y) => {
                           return (
                              <MapSprite
                                 texture={texturesMap[mapEditorContext.activeSprite]}
                                 location={{ x: Math.floor(mousePosition?.x / 32) + x, y: Math.floor(mousePosition?.y / 32) + y }}
                              />
                           );
                        });
                     }
                  })}
               </>
            )}

            {mousePosition && mapEditorContext.currentMapAction === MapActionsList.Delete && (
               <>
                  <Rectangle
                     color={'aa3333'}
                     location={{
                        x: mousePosition?.x - (mousePosition?.x % 32) - ((BrushSizeToPlatesAmount[mapEditorContext.brushSize] - 1) / 2) * 32 - 3,
                        y: mousePosition?.y - (mousePosition?.y % 32) - ((BrushSizeToPlatesAmount[mapEditorContext.brushSize] - 1) / 2) * 32 - 3,
                     }}
                     size={{
                        width: BrushSizeToPlatesAmount[mapEditorContext.brushSize] * 32 + 6,
                        height: BrushSizeToPlatesAmount[mapEditorContext.brushSize] * 32 + 6,
                     }}
                  />
               </>
            )}
         </Stage>
      </div>
   );
};
