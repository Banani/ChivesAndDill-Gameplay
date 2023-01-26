import { ItemTemplate } from '@bananos/types';
import React, { useCallback, useContext } from 'react';
import { ACTIONS } from '../../actions';
import { SocketContext } from '../../contexts';

export const ItemsContext = React.createContext<ItemsContextProps>({} as ItemsContextProps);

interface ItemsContextProps {
   createItemTemplate: (npcTemplate: ItemTemplate) => void;
}

export const ItemsContextProvider = ({ children }: any) => {
   const { socket } = useContext(SocketContext);

   const createItemTemplate = useCallback(
      (itemTemplate: ItemTemplate) => {
         socket.send(JSON.stringify({ actionType: ACTIONS.CREATE_ITEM_TEMPLATE, itemTemplate }));
      },
      [socket]
   );

   return <ItemsContext.Provider value={{ createItemTemplate }}>{children}</ItemsContext.Provider>;
};
