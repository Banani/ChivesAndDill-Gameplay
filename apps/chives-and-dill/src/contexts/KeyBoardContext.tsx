import { filter, find } from 'lodash';
import React, { useEffect, useState } from 'react';

interface KeyBoardHandler {
   id: string;
   matchRegex: string;
   handler: (key: string) => void;
}

interface KeyBoardContextMethods {
   addKeyHandler: (newHandler: KeyBoardHandler) => void;
   removeKeyHandler: (id: string) => void;
}

export const KeyBoardContext = React.createContext<KeyBoardContextMethods>(null);

export const KeyBoardContextProvider = ({ children }) => {
   const [handlers, setHandlers] = useState<KeyBoardHandler[]>([]);

   useEffect(() => {
      const handler = (e) => {
         const matchedHandler = find(handlers, (handler) => e.key.match(handler.matchRegex)) as KeyBoardHandler;
         matchedHandler?.handler(e.key);
      };

      document.addEventListener('keydown', handler);
      return () => document.removeEventListener('keydown', handler);
   }, [handlers]);

   return (
      <KeyBoardContext.Provider
         value={{
            addKeyHandler: (newHandler: KeyBoardHandler) => {
               setHandlers((handlers) => [newHandler, ...handlers]);
            },
            removeKeyHandler: (id: string) => {
               setHandlers((handlers) => filter(handlers, (handler) => handler.id !== id));
            },
         }}
      >
         {children}
      </KeyBoardContext.Provider>
   );
};
