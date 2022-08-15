import { ItemClientMessages } from '@bananos/types';
import React, { useContext } from 'react';
import { SocketContext } from '../app/gameController/socketContext';

export const ItemsApiContext = React.createContext(null);

export const ItemsApi = ({ children }) => {
   const context = useContext(SocketContext);
   const { socket } = context;

   return (
      <ItemsApiContext.Provider
         value={{
            requestItemTemplates: (itemTemplateIds: string[]) => {
               socket?.emit(ItemClientMessages.RequestItemTemplates, {
                  itemTemplateIds,
               });
            },
         }}
      >
         {children}
      </ItemsApiContext.Provider>
   );
};
