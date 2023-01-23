import { Text } from '@inlet/react-pixi';
import { Paper } from '@mui/material';
import { TextStyle } from 'pixi.js';
import { useContext, useMemo } from 'react';
import { MapContext } from '../components/map/MapContextProvider';
import { BrushSize, MapActionsList, MapEditorContext } from './contexts/mapEditorContextProvider';

import { range } from 'lodash';
import { Map, Rectangle } from '../components';
import { MapActions } from './mapActions';

import { MapSprite } from '../components/map/mapSprite/mapSprite';
import styles from './mapEditor.module.scss';
import { SpritePanel } from './spritePanel';

const BrushSizeToPlatesAmount = {
   [BrushSize.Small]: 1,
   [BrushSize.Medium]: 3,
   [BrushSize.Big]: 9,
};

export const MapEditor = () => {
   const mapEditorContext = useContext(MapEditorContext);
   const { isMouseDown, mousePosition, lastMouseDownPosition, previousTranslation, texturesMap, translation, setTranslation } = useContext(MapContext);

   const actionModes: Partial<Record<MapActionsList, any>> = useMemo(
      () => ({
         [MapActionsList.Edit]: {
            onClick: (e: any) => {
               if (mapEditorContext?.activeSprite) {
                  mapEditorContext.updateMapField({
                     brushSize: BrushSizeToPlatesAmount[mapEditorContext.brushSize],
                     x: Math.floor((e.nativeEvent.offsetX - translation.x) / 32),
                     y: Math.floor((e.nativeEvent.offsetY - translation.y) / 32),
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
                  setTranslation({
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
                  x: Math.floor((e.nativeEvent.offsetX - translation.x) / 32),
                  y: Math.floor((e.nativeEvent.offsetY - translation.y) / 32),
               });
            },
         },
      }),
      [
         mapEditorContext?.activeSprite,
         mapEditorContext.brushSize,
         isMouseDown,
         previousTranslation,
         lastMouseDownPosition,
         translation,
         mapEditorContext.deleteMapField,
      ]
   );

   const offset = (BrushSizeToPlatesAmount[mapEditorContext.brushSize] - 1) / 2;

   const mouseCenterSpritePosition = {
      x: Math.floor(((mousePosition?.x ?? 0) - translation.x) / 32) - offset,
      y: Math.floor(((mousePosition?.y ?? 0) - translation.y) / 32) - offset,
   };

   return (
      <>
         <div className={styles['app-view']}>
            {<SpritePanel />}
            <MapActions />

            <Paper className={styles['map-editor']}>
               <Map mapActionStates={actionModes} state={mapEditorContext.currentMapAction}>
                  <Text
                     text={mouseCenterSpritePosition.x + ':' + mouseCenterSpritePosition.y}
                     x={mouseCenterSpritePosition.x * 32 + BrushSizeToPlatesAmount[mapEditorContext.brushSize] * 32 + 6}
                     y={mouseCenterSpritePosition.y * 32 - 18}
                     style={
                        new TextStyle({
                           align: 'center',
                           fontSize: 10,
                           fill: '#ff3030',
                        })
                     }
                  />

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
                                          x: Math.floor((mousePosition?.x - translation.x) / 32) + x,
                                          y: Math.floor((mousePosition?.y - translation.y) / 32) + y,
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
               </Map>
            </Paper>
         </div>
      </>
   );
};
