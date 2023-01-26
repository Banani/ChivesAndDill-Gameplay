import { Text } from '@inlet/react-pixi';
import { Paper } from '@mui/material';
import { TextStyle } from 'pixi.js';
import { useContext, useMemo } from 'react';
import { MapContext, MapSprite, Rectangle } from '../components';

import { Map } from '../components';
import { NpcActions } from './npcActions';

import styles from './mapEditor.module.scss';
import { NpcActionsList, NpcContext } from './NpcContextProvider';
import { NpcTemplatesPanel } from './npcTemplatesPanel';

export const NpcPanel = () => {
   const { isMouseDown, mousePosition, lastMouseDownPosition, previousTranslation, texturesMap, translation, setTranslation } = useContext(MapContext);
   const { currentNpcAction, activeNpcTemplate, addNpc, deleteNpc } = useContext(NpcContext);

   const actionModes: Partial<Record<string, any>> = useMemo(
      () => ({
         [NpcActionsList.Adding]: {
            onClick: (e: any) => {
               if (activeNpcTemplate) {
                  addNpc({
                     x: Math.floor((e.nativeEvent.offsetX - translation.x) / 32),
                     y: Math.floor((e.nativeEvent.offsetY - translation.y) / 32),
                     npcTemplateId: activeNpcTemplate,
                  });
               } else {
                  console.log('Nie wybrano sprite');
               }
            },
         },
         [NpcActionsList.Translate]: {
            onMouseMove: (e: any) => {
               if (isMouseDown) {
                  setTranslation({
                     x: previousTranslation.x + e.clientX - lastMouseDownPosition.x,
                     y: previousTranslation.y + e.clientY - lastMouseDownPosition.y,
                  });
               }
            },
         },
         [NpcActionsList.Delete]: {
            onClick: (e: any) => {
               deleteNpc(Math.floor((e.nativeEvent.offsetX - translation.x) / 32) + ':' + Math.floor((e.nativeEvent.offsetY - translation.y) / 32));
            },
         },
      }),
      [isMouseDown, activeNpcTemplate, addNpc, translation, deleteNpc]
   );

   const mouseCenterSpritePosition = {
      x: Math.floor(((mousePosition?.x ?? 0) - translation.x) / 32),
      y: Math.floor(((mousePosition?.y ?? 0) - translation.y) / 32),
   };

   return (
      <>
         <div className={styles['app-view']}>
            <NpcTemplatesPanel />
            <NpcActions />

            <Paper className={styles['map-editor']}>
               <Map mapActionStates={actionModes} state={currentNpcAction}>
                  <Text
                     text={mouseCenterSpritePosition.x + ':' + mouseCenterSpritePosition.y}
                     x={mouseCenterSpritePosition.x * 32 + 32 + 6}
                     y={mouseCenterSpritePosition.y * 32 - 18}
                     style={
                        new TextStyle({
                           align: 'center',
                           fontSize: 10,
                           fill: '#ff3030',
                        })
                     }
                  />

                  {mousePosition && !!activeNpcTemplate && currentNpcAction === NpcActionsList.Adding && (
                     <>
                        <Rectangle
                           color={'33aa33'}
                           location={{
                              x: mouseCenterSpritePosition.x * 32 - 3,
                              y: mouseCenterSpritePosition.y * 32 - 3,
                           }}
                           size={{
                              width: 32 + 6,
                              height: 32 + 6,
                           }}
                        />

                        <MapSprite
                           texture={texturesMap['citizen']}
                           location={{
                              x: Math.floor((mousePosition?.x - translation.x) / 32),
                              y: Math.floor((mousePosition?.y - translation.y) / 32),
                           }}
                        />
                     </>
                  )}

                  {mousePosition && currentNpcAction === NpcActionsList.Delete && (
                     <>
                        <Rectangle
                           color={'aa3333'}
                           location={{
                              x: mouseCenterSpritePosition.x * 32 - 3,
                              y: mouseCenterSpritePosition.y * 32 - 3,
                           }}
                           size={{
                              width: 32 + 6,
                              height: 32 + 6,
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
