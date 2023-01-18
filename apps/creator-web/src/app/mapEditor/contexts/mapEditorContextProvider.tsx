import React, { useCallback, useContext, useState } from 'react';
import { ACTIONS } from '../../actions';
import { SocketContext } from '../../contexts';
import { NpcTemplate } from '../../dialogs';

export const MapEditorContext = React.createContext<MapEditorContextProps>({} as MapEditorContextProps);

export enum MapActionsList {
   Edit = 'Edit',
   Translate = 'Translate',
   Delete = 'Delete',
}

export enum BrushSize {
   Small = 'Small',
   Medium = 'Medium',
   Big = 'Big',
}

interface Vector {
   x: number;
   y: number;
}

interface MapEditorContextProps {
   updateMapField: (val: { x: number; y: number; brushSize: number; spriteId: string }) => void;
   activeSprite: any;
   setActiveSprite: any;
   currentMapAction: MapActionsList;
   setCurrentMapAction: any;
   deleteMapField: (val: { x: number; y: number; brushSize: number }) => void;
   brushSize: BrushSize;
   setBrushSize: (brushSize: BrushSize) => void;
   translation: Vector;
   setTranslation: (v: Vector) => void;
   createNpcTemplate: (npcTemplate: NpcTemplate) => void;
}

export const MapEditorContextProvider = ({ children }: any) => {
   const { socket } = useContext(SocketContext);
   const [activeSprite, setActiveSprite] = useState<null>();
   const [currentMapAction, setCurrentMapAction] = useState(MapActionsList.Edit);
   const [brushSize, setBrushSize] = useState(BrushSize.Small);
   const [translation, setTranslation] = useState<Vector>({ x: 0, y: 0 });

   const updateMapField = useCallback(
      ({ x, y, spriteId, brushSize }) => {
         socket.send(JSON.stringify({ actionType: ACTIONS.UPDATE_MAP_FIELD, x, y, spriteId, brushSize }));
      },
      [socket]
   );

   const deleteMapField = useCallback(
      ({ x, y, brushSize }) => {
         socket.send(JSON.stringify({ actionType: ACTIONS.DELETE_MAP_FIELD, brushSize, x, y }));
      },
      [socket]
   );

   const createNpcTemplate = useCallback(
      (npcTemplate: NpcTemplate) => {
         socket.send(JSON.stringify({ actionType: ACTIONS.CREATE_NPC_TEMPLATE, npcTemplate }));
      },
      [socket]
   );

   return (
      <MapEditorContext.Provider
         value={{
            updateMapField,
            activeSprite,
            setActiveSprite,
            currentMapAction,
            setCurrentMapAction,
            deleteMapField,
            brushSize,
            setBrushSize,
            translation,
            setTranslation,

            createNpcTemplate,
         }}
      >
         {children}
      </MapEditorContext.Provider>
   );
};
