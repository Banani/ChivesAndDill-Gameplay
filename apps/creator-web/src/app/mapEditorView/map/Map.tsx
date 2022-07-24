import { Stage } from '@inlet/react-pixi';
import _ from 'lodash';
import * as PIXI from 'pixi.js';
import { range } from 'lodash';
import { useCallback, useContext, useEffect, useState } from 'react';
import { MapSprite } from './mapSprite/mapSprite';
import { BLOCK_SIZE } from '../../consts';
import { Texture } from 'pixi.js';
import { PackageContext } from '../../contexts/packageContext';
import { SocketContext } from '../../contexts';
import { MapEditorContext } from '../contexts/mapEditorContextProvider';
import { Location } from '@bananos/types';
import { Rectangle } from './shape/shape';

const mapSchema = {
   '1': {
      path: '../../../assets/293455953_3410615272514371_4647754778913308020_n.png',
      location: {
         y: 4 * BLOCK_SIZE,
         x: 4 * BLOCK_SIZE,
      },
   },
   '2': {
      path: '../../../assets/293455953_3410615272514371_4647754778913308020_n.png',
      location: {
         y: 4 * BLOCK_SIZE,
         x: 5 * BLOCK_SIZE,
      },
   },
   '3': {
      path: '../../../assets/293455953_3410615272514371_4647754778913308020_n.png',
      location: {
         y: 4 * BLOCK_SIZE,
         x: 6 * BLOCK_SIZE,
      },
   },
   '4': {
      path: '../../../assets/293455953_3410615272514371_4647754778913308020_n.png',
      location: {
         y: 4 * BLOCK_SIZE,
         x: 7 * BLOCK_SIZE,
      },
   },
};

export const Map = () => {
   const [texturesMap, setTexturesMap] = useState<Record<string, Texture>>({});
   const [mousePosition, setMousePosition] = useState<Location | null>(null);
   const packageContext = useContext(PackageContext);
   const mapEditorContext = useContext(MapEditorContext);

   useEffect(() => {
      const output: Record<string, Texture> = {};

      _.forEach(mapSchema, (mapElement, key) => {
         const baseTexture = PIXI.BaseTexture.from(mapElement.path);
         output[key] = new PIXI.Texture(baseTexture, new PIXI.Rectangle(mapElement.location.x + 1, mapElement.location.y + 1, 30, 30));
      });

      setTexturesMap(output);
   }, []);

   const mapClick = useCallback(
      (e) => {
         if (mapEditorContext.activeSprite) {
            mapEditorContext.updateMapField({
               x: Math.floor(e.nativeEvent.offsetX / 32),
               y: Math.floor(e.nativeEvent.offsetY / 32),
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
         {mousePosition && (
            <Rectangle
               color={'fff'}
               location={{ x: mousePosition?.x - (mousePosition?.x % 32) - 1, y: mousePosition?.y - (mousePosition?.y % 32) - 1 }}
               size={{ width: 34, height: 34 }}
            />
         )}
      </Stage>
   );
};
