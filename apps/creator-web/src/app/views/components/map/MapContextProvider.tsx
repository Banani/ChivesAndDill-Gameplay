import { Texture } from 'pixi.js';
import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';

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
    mapSize: { width: number, height: number };
    setMapSize: Dispatch<SetStateAction<{ width: number; height: number; }>>;
    centerAt: (vec: Vector) => void;
}

export const MapContextProvider = ({ children }: any) => {
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
    const [lastMouseDownPosition, setLastMouseDownPosition] = useState({ x: 0, y: 0 });
    const [previousTranslation, setPreviousTranslation] = useState({ x: 0, y: 0 });
    const [texturesMap, setTexturesMap] = useState<Record<string, Texture>>({});
    const [translation, setTranslation] = useState<Vector>({ x: 0, y: 0 });
    const [mapSize, setMapSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

    const centerAt = useCallback((vec: Vector) => {
        setTranslation({ x: vec.x + mapSize.width / 2, y: vec.y + mapSize.height / 2 });
    }, [mapSize]);

    return (
        <MapContext.Provider
            value={{
                mapSize,
                setMapSize,
                centerAt,
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
