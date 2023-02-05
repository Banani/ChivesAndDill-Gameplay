import { ItemTemplate } from '@bananos/types';
import React, { useCallback, useContext, useState } from 'react';
import { ACTIONS } from '../../actions';
import { SocketContext } from '../../contexts';

export const ItemsContext = React.createContext<ItemsContextProps>({} as ItemsContextProps);

interface ItemsContextProps {
   createItemTemplate: (itemTemplate: ItemTemplate) => void;
   deleteItemTemplate: (itemTemplate: string) => void;
   activeItemTemplate: ItemTemplate | null;
   setActiveItemTemplate: (itemTemplate: ItemTemplate | null) => void;
   updateItemTemplate: (itemTemplate: ItemTemplate) => void;
}

export const ItemsContextProvider = ({ children }: any) => {
   const { socket } = useContext(SocketContext);
   const [activeItemTemplate, setActiveItemTemplate] = useState<ItemTemplate | null>(null);

   const createItemTemplate = useCallback(
      (itemTemplate: ItemTemplate) => {
         socket.send(JSON.stringify({ actionType: ACTIONS.CREATE_ITEM_TEMPLATE, itemTemplate }));
      },
      [socket]
   );

   const deleteItemTemplate = useCallback(
      (itemTemplateId: string) => {
         socket.send(JSON.stringify({ actionType: ACTIONS.DELETE_ITEM_TEMPLATE, itemTemplateId }));
      },
      [socket]
   );

   const updateItemTemplate = useCallback(
      (itemTemplate: ItemTemplate) => {
         socket.send(JSON.stringify({ actionType: ACTIONS.UPDATE_ITEM_TEMPLATE, itemTemplate }));
      },
      [socket]
   );

   return (
      <ItemsContext.Provider value={{ createItemTemplate, deleteItemTemplate, activeItemTemplate, setActiveItemTemplate, updateItemTemplate }}>
         {children}
      </ItemsContext.Provider>
   );
};
