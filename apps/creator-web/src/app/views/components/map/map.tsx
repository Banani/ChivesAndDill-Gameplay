import { Container, Stage } from '@inlet/react-pixi';
import _, { throttle } from 'lodash';
import * as PIXI from 'pixi.js';
import { Texture } from 'pixi.js';
import { FunctionComponent, useCallback, useContext, useEffect, useState } from 'react';
import { BLOCK_SIZE } from '../../../consts';
import { PackageContext } from '../../../contexts/packageContext';
import { MapSprite } from './mapSprite/mapSprite';

import styles from './map.module.scss';
import { MapContext } from './MapContextProvider';

type MapActionStates = Record<
   string,
   {
      onClick?: (e: any) => void;
      onMouseMove?: (e: any) => void;
      onMouseLeave?: (e: any) => void;
   }
>;

interface MapProps {
   mapActionStates: MapActionStates;
   state: string;
}

export const Map: FunctionComponent<MapProps> = ({ mapActionStates, state, children }) => {
   const packageContext = useContext(PackageContext);
   const { setIsMouseDown, setMousePosition, setLastMouseDownPosition, setPreviousTranslation, texturesMap, setTexturesMap, translation } =
      useContext(MapContext);
   const [stage, setStage] = useState<null | HTMLDivElement>(null);

   useEffect(() => {
      const output: Record<string, Texture> = {};

      const loader = new PIXI.Loader();
      loader.pre((resource, next) => {
         resource.loadType = PIXI.LoaderResource.LOAD_TYPE.XHR;
         next();
      });
      _.forEach(packageContext?.backendStore?.sprites?.data, (mapElement, key) => {
         const path = mapElement.spriteSheet.indexOf('https') === -1 ? '../../../assets/' + mapElement.spriteSheet : mapElement.spriteSheet;

         if (!loader.resources[mapElement.spriteSheet]) {
            loader.add({
               name: mapElement.spriteSheet,
               url: path,
               crossOrigin: 'no-cors',
               loadType: PIXI.LoaderResource.LOAD_TYPE.XHR,
            });
         }
      });

      loader.load((loader, resources) => {
         _.forEach(packageContext?.backendStore?.sprites?.data, (mapElement, key) => {
            const baseTexture = resources[mapElement.spriteSheet]?.texture?.baseTexture;
            if (baseTexture) {
               output[key] = new PIXI.Texture(baseTexture, new PIXI.Rectangle(mapElement.x * BLOCK_SIZE + 1, mapElement.y * BLOCK_SIZE + 1, 30, 30));
            }
         });
         setTexturesMap(output);
      });
   }, [packageContext?.backendStore?.sprites?.data]);

   const mapClick = useCallback(
      (e) => {
         if (mapActionStates[state]) {
            mapActionStates[state].onClick?.(e);
         }
      },
      [state, mapActionStates]
   );

   const onMouseMove = useCallback(
      throttle((e) => {
         setMousePosition({
            x: e.nativeEvent.offsetX,
            y: e.nativeEvent.offsetY,
         });
         if (mapActionStates[state]) {
            mapActionStates[state].onMouseMove?.(e);
         }
      }, 25),
      [state, mapActionStates]
   );

   const onMouseLeave = useCallback((e) => {
      setMousePosition(null);
      if (mapActionStates[state]) {
         mapActionStates[state].onMouseLeave?.(e);
      }
   }, []);

   if (!Object.keys(texturesMap).length || !packageContext?.backendStore?.map) {
      return <></>;
   }

   return (
      <div className={styles['stage']} ref={(newRef) => setStage(newRef)}>
         <Stage
            width={stage?.clientWidth ?? 900}
            height={(stage?.clientHeight ?? 600) - 10}
            options={{ backgroundColor: 0x000000, autoDensity: true }}
            onClick={mapClick}
            onMouseDown={(e) => {
               setLastMouseDownPosition({ x: e.clientX, y: e.clientY });
               setPreviousTranslation(translation);
               setIsMouseDown(true);
            }}
            onMouseUp={() => setIsMouseDown(false)}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
         >
            <Container position={[translation.x, translation.y]}>
               {_.map(packageContext.backendStore.map.data, ({ x, y, spriteId }, key) => {
                  return <MapSprite key={key} location={{ x, y }} texture={texturesMap[spriteId]} />;
               })}

               {children}
            </Container>
         </Stage>
      </div>
   );
};
