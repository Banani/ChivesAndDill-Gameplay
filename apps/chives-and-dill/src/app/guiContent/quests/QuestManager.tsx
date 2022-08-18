import { useEnginePackageProvider } from 'apps/chives-and-dill/src/hooks';
import React from 'react';
import { QuestLog, QuestsSideView } from './components';
import { SelectedQuestProvider } from './contexts/SelectedQuestProvider';

export const QuestManager = () => {
   const { questProgress } = useEnginePackageProvider();

   return (
      <SelectedQuestProvider>
         {Object.keys(questProgress ?? {}).length && <QuestsSideView />}
         <QuestLog />
      </SelectedQuestProvider>
   );
};
