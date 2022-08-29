import React, { useState } from 'react';

interface MenuAction {
   label: string;
   action: () => void;
}

interface MenuContextMethods {
   setActions: (actions: MenuAction[]) => void;
   actions: MenuAction[];
}

export const MenuContext = React.createContext<MenuContextMethods>(null);

export const MenuContextProvider = ({ children }) => {
   const [actions, setActions] = useState<MenuAction[]>([]);

   return <MenuContext.Provider value={{ setActions, actions }}>{children}</MenuContext.Provider>;
};
