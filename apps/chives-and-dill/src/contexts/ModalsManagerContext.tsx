import React, { useContext, useEffect, useState } from 'react';
import { KeyBoardContext } from './KeyBoardContext';

export enum GlobalModal {
   ChatChannelModal = 'ChatChannelModal',
}

interface ModalsManagerContextMethods {
   activeGlobalModal: GlobalModal;
   setActiveGlobalModal: (modal: GlobalModal) => void;
}

export const ModalsManagerContext = React.createContext<ModalsManagerContextMethods>(null);

export const ModalsManagerContextProvider = ({ children }) => {
   const [activeGlobalModal, setActiveGlobalModal] = useState<GlobalModal>(null);
   const keyBoardContext = useContext(KeyBoardContext);

   useEffect(() => {
      keyBoardContext.addKeyHandler({
         id: 'ModalsManagerEscape',
         matchRegex: 'Escape',
         handler: () => setActiveGlobalModal(null),
      });
      keyBoardContext.addKeyHandler({
         id: 'ModalsManagerO',
         matchRegex: 'o',
         handler: () => setActiveGlobalModal(GlobalModal.ChatChannelModal),
      });

      return () => keyBoardContext.removeKeyHandler('ModalsManagerEscape');
   }, []);

   return (
      <ModalsManagerContext.Provider
         value={{
            activeGlobalModal,
            setActiveGlobalModal,
         }}
      >
         {children}
      </ModalsManagerContext.Provider>
   );
};
