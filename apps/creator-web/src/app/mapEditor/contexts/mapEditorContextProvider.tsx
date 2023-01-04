import React, { useCallback, useContext, useState } from 'react';
import { ACTIONS } from '../../actions';
import { SocketContext } from '../../contexts';

export const MapEditorContext = React.createContext<MapEditorContextProps>({} as MapEditorContextProps);

export enum MapActionsList {
   Edit = 'Edit',
   Translate = 'Translate',
   Delete = 'Delete',
}

interface MapEditorContextProps {
   updateMapField: any;
   activeSprite: any;
   setActiveSprite: any;
   currentMapAction: MapActionsList;
   setCurrentMapAction: any;
   deleteMapField: (val: { x: number; y: number }) => void;
}

export const MapEditorContextProvider = ({ children }: any) => {
   const { socket } = useContext(SocketContext);
   const [activeSprite, setActiveSprite] = useState<null>();
   const [currentMapAction, setCurrentMapAction] = useState(MapActionsList.Edit);

   const updateMapField = useCallback(
      ({ x, y, spriteId }) => {
         socket.send(JSON.stringify({ actionType: ACTIONS.UPDATE_MAP_FIELD, x, y, spriteId }));
      },
      [socket]
   );

   const deleteMapField = useCallback(
      ({ x, y }) => {
         socket.send(JSON.stringify({ actionType: ACTIONS.DELETE_MAP_FIELD, x, y }));
      },
      [socket]
   );

   return (
      <MapEditorContext.Provider value={{ updateMapField, activeSprite, setActiveSprite, currentMapAction, setCurrentMapAction, deleteMapField }}>
         {children}
      </MapEditorContext.Provider>
   );
};
