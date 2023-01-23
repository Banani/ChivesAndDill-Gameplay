import { Texture } from 'pixi.js';
import React, { useState } from 'react';

export const MapContext = React.createContext<MapContextProps>({} as MapContextProps);

interface Vector {
   x: number;
   y: number;
}

interface MapContextProps {
   isMouseDown: boolean;
   setIsMouseDown: (isMouseDown: boolean) => void;
   mousePosition: { x: number; y: number } | null;
   setMousePosition: (position: { x: number; y: number } | null) => void;
   lastMouseDownPosition: { x: number; y: number };
   setLastMouseDownPosition: (position: { x: number; y: number }) => void;
   previousTranslation: { x: number; y: number };
   setPreviousTranslation: (position: { x: number; y: number }) => void;
   texturesMap: Record<string, Texture>;
   setTexturesMap: (texturesMap: Record<string, Texture>) => void;
   translation: Vector;
   setTranslation: (vec: Vector) => void;
}

export const MapContextProvider = ({ children }: any) => {
   const [isMouseDown, setIsMouseDown] = useState(false);
   const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
   const [lastMouseDownPosition, setLastMouseDownPosition] = useState({ x: 0, y: 0 });
   const [previousTranslation, setPreviousTranslation] = useState({ x: 0, y: 0 });
   const [texturesMap, setTexturesMap] = useState<Record<string, Texture>>({});
   const [translation, setTranslation] = useState<Vector>({ x: 0, y: 0 });

   return (
      <MapContext.Provider
         value={{
            isMouseDown,
            setIsMouseDown,
            mousePosition,
            setMousePosition,
            lastMouseDownPosition,
            setLastMouseDownPosition,
            previousTranslation,
            setPreviousTranslation,
            texturesMap,
            setTexturesMap,
            translation,
            setTranslation,
         }}
      >
         {children}
      </MapContext.Provider>
   );
};
