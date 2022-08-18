import React, { useState } from 'react';

interface SelectedQuestProviderProps {
   setSelectedQuestId: (questId: string) => void;
   selectedQuestId: string;
}

export const SelectedQuestProviderContext = React.createContext<SelectedQuestProviderProps>(null);

export const SelectedQuestProvider = ({ children }) => {
   const [selectedQuestId, setSelectedQuestId] = useState(null);

   return <SelectedQuestProviderContext.Provider value={{ selectedQuestId, setSelectedQuestId }}>{children}</SelectedQuestProviderContext.Provider>;
};
