import { filter, find } from 'lodash';
import React, { useEffect, useState } from 'react';

interface KeyBoardHandler {
   id: string;
   matchRegex: string;
   keydown?: (key: string) => void;
   keyup?: (key: string) => void;
}

interface KeyBoardContextMethods {
   addKeyHandler: (newHandler: KeyBoardHandler) => void;
   removeKeyHandler: (id: string) => void;
}

export const KeyBoardContext = React.createContext<KeyBoardContextMethods>({ addKeyHandler: () => {}, removeKeyHandler: () => {} });

export const KeyBoardContextProvider: React.FunctionComponent = ({ children }) => {
   const [handlers, setHandlers] = useState<KeyBoardHandler[]>([]);

   useEffect(() => {
      const keyDownHandler = (e: any) => {
         const matchedHandler = find(handlers, (handler) => e.key.match(handler.matchRegex)) as KeyBoardHandler;
         matchedHandler?.keydown?.(e.key);
      };

      const keyUpHandler = (e: any) => {
         const matchedHandler = find(handlers, (handler) => e.key.match(handler.matchRegex)) as KeyBoardHandler;
         matchedHandler?.keyup?.(e.key);
      };

      document.addEventListener('keyup', keyUpHandler);
      document.addEventListener('keydown', keyDownHandler);

      return () => {
         document.removeEventListener('keyup', keyUpHandler);
         document.removeEventListener('keydown', keyDownHandler);
      };
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
