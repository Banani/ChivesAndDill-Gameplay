import { GlobalStoreModule } from '@bananos/types';
import { GlobalModal, ModalsManagerContext } from 'apps/chives-and-dill/src/contexts/ModalsManagerContext';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import _ from 'lodash';
import React, { useContext, useState } from 'react';
import questionMark from '../../../../../assets/spritesheets/questNpc/questionMark.png';
import { SelectedQuestProviderContext } from '../../contexts/SelectedQuestProvider';
import { QuestStagePart } from '../questStagePart/QuestStagePart';
import styles from './QuestsSideView.module.scss';

export const QuestsSideView = () => {
    const { setActiveGlobalModal } = useContext(ModalsManagerContext);
    const { setSelectedQuestId } = useContext(SelectedQuestProviderContext);
    const { data: questProgress } = useEngineModuleReader(GlobalStoreModule.QUEST_PROGRESS);
    const { data: questDefinition } = useEngineModuleReader(GlobalStoreModule.QUEST_DEFINITION);

    const [showQuestsView, setShowQuestsView] = useState(true);

    let questsCounter = 0;

    const renderQuests = _.map(questProgress, (currentQuestProgress, questId) => {
        const questStage = questDefinition[questId]?.stages[currentQuestProgress.activeStage];
        if (!currentQuestProgress.allStagesCompleted) {
            questsCounter++;
        }

        return (
            <div
                className={styles.questMainContainer}
                key={questId}
                onClick={() => {
                    setSelectedQuestId(questId);
                    setActiveGlobalModal(GlobalModal.QuestLog);
                }}
            >
                <div className={styles.questionMarkContainer}>
                    {currentQuestProgress.allStagesCompleted ? <img src={questionMark} className={styles.questionMark} /> : questsCounter}
                </div>
                <div className={styles.questDefinitionContainer}>
                    <div className={styles.questTitle}>{questDefinition[questId]?.name}</div>
                    <div className={styles.questDesc}>
                        {currentQuestProgress.allStagesCompleted ? (
                            <div className={styles.stagePartDone}>Ready for turn-in</div>
                        ) : (
                            _.map(questStage?.stageParts, (stagePart, stagePartId) => (
                                <div>
                                    <QuestStagePart
                                        questStagePart={stagePart}
                                        stagePartProgress={currentQuestProgress.stagesProgress[currentQuestProgress.activeStage][stagePartId]}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </div>
                {currentQuestProgress.allStagesCompleted ? (
                    <div className={styles.questionMarkRightContainer}>
                        <img src={questionMark} className={styles.questionMark} />
                    </div>
                ) : null}
            </div>
        );
    });

    return (
        <div className={styles.questsSideViewContainer}>
            <div className={styles.sectionTitleContainer}>
                <div className={styles.sectionTitle}>Quests</div>
                <button className={styles.questViewToggle} onClick={() => setShowQuestsView(!showQuestsView)}>
                    <span className={`${styles.ToggleTriangleUp} ${showQuestsView ? '' : styles.ToggleTriangleDown}`}></span>
                </button>
            </div>
            {showQuestsView ? renderQuests : null}
        </div>
    );
};
