import { Location } from '@bananos/types';
import { Container, Stage } from '@inlet/react-pixi';
import _, { range, throttle } from 'lodash';
import * as PIXI from 'pixi.js';
import { Texture } from 'pixi.js';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
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
   const [isMouseDown, setIsMouseDown] = useState(false);
   const [previousTranslation, setPreviousTranslation] = useState({ x: 0, y: 0 });
   const [lastMouseDownPosition, setLastMouseDownPosition] = useState({ x: 0, y: 0 });

   const actionModes: Partial<Record<MapActionsList, any>> = useMemo(
      () => ({
         [MapActionsList.Edit]: {
            onClick: (e: any) => {
               if (mapEditorContext?.activeSprite) {
                  mapEditorContext.updateMapField({
                     brushSize: BrushSizeToPlatesAmount[mapEditorContext.brushSize],
                     x: Math.floor((e.nativeEvent.offsetX - mapEditorContext.translation.x) / 32),
                     y: Math.floor((e.nativeEvent.offsetY - mapEditorContext.translation.y) / 32),
                     spriteId: mapEditorContext.activeSprite,
                  });
               } else {
                  console.log('Nie wybrano sprite');
               }
            },
         },
         [MapActionsList.Translate]: {
            onMouseMove: (e: any) => {
               if (isMouseDown) {
                  mapEditorContext.setTranslation({
                     x: previousTranslation.x + e.clientX - lastMouseDownPosition.x,
                     y: previousTranslation.y + e.clientY - lastMouseDownPosition.y,
                  });
               }
            },
         },
         [MapActionsList.Delete]: {
            onClick: (e: any) => {
               mapEditorContext.deleteMapField({
                  brushSize: BrushSizeToPlatesAmount[mapEditorContext.brushSize],
                  x: Math.floor((e.nativeEvent.offsetX - mapEditorContext.translation.x) / 32),
                  y: Math.floor((e.nativeEvent.offsetY - mapEditorContext.translation.y) / 32),
               });
            },
         },
      }),
      [mapEditorContext?.activeSprite, mapEditorContext.brushSize, isMouseDown, previousTranslation, lastMouseDownPosition, mapEditorContext.translation]
   );

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

   const onMouseMove = useCallback(
      throttle((e) => {
         setMousePosition({
            x: e.nativeEvent.offsetX,
            y: e.nativeEvent.offsetY,
         });
         if (mapEditorContext && actionModes[mapEditorContext.currentMapAction] && actionModes[mapEditorContext.currentMapAction].onMouseMove) {
            actionModes[mapEditorContext.currentMapAction].onMouseMove(e);
         }
      }, 25),
      [mapEditorContext.currentMapAction, actionModes]
   );

   if (!Object.keys(texturesMap).length || !packageContext?.backendStore?.map) {
      return <></>;
   }

   const offset = (BrushSizeToPlatesAmount[mapEditorContext.brushSize] - 1) / 2;

   const mouseCenterSpritePosition = {
      x: Math.floor(((mousePosition?.x ?? 0) - mapEditorContext.translation.x) / 32) - offset,
      y: Math.floor(((mousePosition?.y ?? 0) - mapEditorContext.translation.y) / 32) - offset,
   };

   return (
      <div className={styles['stage']} ref={(newRef) => setStage(newRef)}>
         <Stage
            width={stage?.clientWidth ?? 900}
            height={(stage?.clientHeight ?? 600) - 10}
            options={{ backgroundColor: 0x000000, autoDensity: true }}
            onClick={mapClick}
            onMouseDown={(e) => {
               setLastMouseDownPosition({ x: e.clientX, y: e.clientY });
               setPreviousTranslation(mapEditorContext.translation);
               setIsMouseDown(true);
            }}
            onMouseUp={() => setIsMouseDown(false)}
            onMouseMove={onMouseMove}
            onMouseLeave={() => {
               setMousePosition(null);
            }}
         >
            <Container position={[mapEditorContext.translation.x, mapEditorContext.translation.y]}>
               {_.map(packageContext.backendStore.map.data, ({ x, y, spriteId }, key) => {
                  return <MapSprite key={key} location={{ x, y }} texture={texturesMap[spriteId]} />;
               })}
               {mousePosition && mapEditorContext?.activeSprite && mapEditorContext.currentMapAction === MapActionsList.Edit && (
                  <>
                     <Rectangle
                        color={'33aa33'}
                        location={{
                           x: mouseCenterSpritePosition.x * 32 - 3,
                           y: mouseCenterSpritePosition.y * 32 - 3,
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
                                    location={{
                                       x: Math.floor((mousePosition?.x - mapEditorContext.translation.x) / 32) + x,
                                       y: Math.floor((mousePosition?.y - mapEditorContext.translation.y) / 32) + y,
                                    }}
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
                           x: mouseCenterSpritePosition.x * 32 - 3,
                           y: mouseCenterSpritePosition.y * 32 - 3,
                        }}
                        size={{
                           width: BrushSizeToPlatesAmount[mapEditorContext.brushSize] * 32 + 6,
                           height: BrushSizeToPlatesAmount[mapEditorContext.brushSize] * 32 + 6,
                        }}
                     />
                  </>
               )}
            </Container>
         </Stage>
      </div>
   );
};
