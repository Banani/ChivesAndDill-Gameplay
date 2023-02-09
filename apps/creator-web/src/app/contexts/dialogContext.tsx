import React, { useState } from 'react';

export const DialogContext = React.createContext<any>(null);

export enum Dialogs {
   NpcTemplateDialogs = 'NpcTemplateDialogs',
   ItemDialog = 'ItemDialog',
   QuestDialog = 'QuestDialog',
}

export const DialogProvider = ({ children }: any) => {
   const [activeDialog, setActiveDialog] = useState<Dialogs | null>(null);

   return <DialogContext.Provider value={{ activeDialog, setActiveDialog }}>{children}</DialogContext.Provider>;
};