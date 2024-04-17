import { GlobalStoreModule } from '@bananos/types';
import CloseIcon from '@mui/icons-material/Close';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import _ from 'lodash';
import React, { useContext } from 'react';
import { SelectedQuestProviderContext } from '../../contexts/SelectedQuestProvider';

import { GlobalModal, ModalsManagerContext } from 'apps/chives-and-dill/src/contexts/ModalsManagerContext';
import { SquareButton } from '../../../components/squareButton/SquareButton';
import { QuestDescription } from '../questDescription';
import styles from './QuestLog.module.scss';

export const QuestLog = () => {
    const { activeGlobalModal, setActiveGlobalModal } = useContext(ModalsManagerContext);
    const { selectedQuestId, setSelectedQuestId } = useContext(SelectedQuestProviderContext);
    const { data: questProgress } = useEngineModuleReader(GlobalStoreModule.QUEST_PROGRESS);
    const { data: questDefinition } = useEngineModuleReader(GlobalStoreModule.QUEST_DEFINITION);

    const renderQuests = _.map(questProgress, (quest, questId) => (
        <div key={questId}
            className={`${styles.QuestTitle} ${questId === selectedQuestId ? styles.ActiveTitle : ''}`}
            onClick={() => setSelectedQuestId(questId)}>
            {questDefinition[questId]?.name}
        </div>
    ));

    return activeGlobalModal === GlobalModal.QuestLog ? (
        <div className={styles.QuestLog}>
            <div className={styles.QuestLogText}>Quest Log</div>
            <div className={styles.ButtonContainer}>
                <SquareButton onClick={() => setActiveGlobalModal(null)}><CloseIcon fontSize="inherit" /></SquareButton>
            </div>

            <div className={styles.QuestList}>
                {Object.keys(questProgress).length
                    ? renderQuests
                    : <div className={styles.EmptyQuestLog}>No Active Quests</div>
                }
            </div>

            <div className={styles.QuestDetails}>
                {selectedQuestId ? <QuestDescription questSchema={questDefinition[selectedQuestId]} /> : null}
            </div>
        </div>
    ) : null;
};
