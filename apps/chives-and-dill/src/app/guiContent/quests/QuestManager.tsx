import { GlobalStoreModule } from '@bananos/types';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import React from 'react';
import { QuestLog, QuestsSideView } from './components';
import { SelectedQuestProvider } from './contexts/SelectedQuestProvider';

export const QuestManager = () => {
    const { data: questProgress } = useEngineModuleReader(GlobalStoreModule.QUEST_PROGRESS);

    return (
        <SelectedQuestProvider>
            {Object.keys(questProgress ?? {}).length && <QuestsSideView />}
            <QuestLog />
        </SelectedQuestProvider>
    );
};
