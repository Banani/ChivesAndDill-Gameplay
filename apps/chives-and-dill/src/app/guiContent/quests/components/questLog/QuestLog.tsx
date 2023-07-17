import { GlobalStoreModule } from '@bananos/types';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import _ from 'lodash';
import React, { useContext } from 'react';
import { SelectedQuestProviderContext } from '../../contexts/SelectedQuestProvider';
import { QuestDescription } from '../questDescription';
import CloseIcon from '@mui/icons-material/Close';

import styles from './QuestLog.module.scss';
import { SquareButton } from '../../../components/squareButton/SquareButton';

export const QuestLog = () => {
    const { selectedQuestId, setSelectedQuestId } = useContext(SelectedQuestProviderContext);
    const { data: questProgress } = useEngineModuleReader(GlobalStoreModule.QUEST_PROGRESS);
    const { data: questDefinition } = useEngineModuleReader(GlobalStoreModule.QUEST_DEFINITION);

    const renderQuests = _.map(questProgress, (quest, questId) => (
        <div key={questId}>
            <div className={`${styles.QuestTitle} ${questId === selectedQuestId ? styles.ActiveTitle : ''}`} onClick={() => setSelectedQuestId(questId)}>
                {questDefinition[questId]?.name}
            </div>
        </div>
    ));

    return selectedQuestId ? (
        <div className={styles.QuestLog}>
            <div className={styles.QuestLogText}>Quest Log</div>
            <div className={styles.ButtonContainer}>
                <SquareButton onClick={() => setSelectedQuestId(null)}><CloseIcon fontSize="inherit" /></SquareButton>
            </div>
            <div className={styles.QuestList}>{renderQuests ? renderQuests : null}</div>
            <div className={styles.QuestDetails}>
                <QuestDescription questSchema={questDefinition[selectedQuestId]} />
            </div>
        </div>
    ) : null;
};
