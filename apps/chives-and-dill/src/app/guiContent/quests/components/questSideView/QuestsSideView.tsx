import { GlobalStoreModule } from '@bananos/types';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import _ from 'lodash';
import React, { useContext, useState } from 'react';
import { SelectedQuestProviderContext } from '../../contexts/SelectedQuestProvider';
import { QuestStagePart } from '../questStagePart/QuestStagePart';
import styles from './QuestsSideView.module.scss';

export const QuestsSideView = () => {
   const { setSelectedQuestId } = useContext(SelectedQuestProviderContext);
   const { data: questProgress } = useEngineModuleReader(GlobalStoreModule.QUEST_PROGRESS);
   const { data: questDefinition } = useEngineModuleReader(GlobalStoreModule.QUEST_DEFINITION);

   const [showQuestsView, updateShowQuestsView] = useState(true);

   const renderQuests = _.map(questProgress, (currentQuestProgress, questId) => {
      const questStage = questDefinition[questId].stages[currentQuestProgress.activeStage];

      return (
         <div key={questId}>
            <div className={styles.questTitle} onClick={() => setSelectedQuestId(questId)}>
               {currentQuestProgress.allStagesCompleted ? '? ' : ''}
               {questDefinition[questId].name}
            </div>
            <div className={styles.questDesc}>
               {_.map(questStage.stageParts, (stagePart, stagePartId) => (
                  <div className={currentQuestProgress.stagesProgress[currentQuestProgress.activeStage][stagePartId].isDone ? styles.stagePartDone : ''}>
                     <QuestStagePart
                        questStagePart={stagePart}
                        stagePartProgress={currentQuestProgress.stagesProgress[currentQuestProgress.activeStage][stagePartId]}
                     />
                  </div>
               ))}
            </div>
         </div>
      );
   });

   return (
      <div className={styles.questsSideViewContainer}>
         <div className={styles.sectionTitleContainer}>
            <div className={styles.sectionTitle}>Quests</div>
            <button className={styles.questViewToggle} onClick={() => updateShowQuestsView(!showQuestsView)}>
               {showQuestsView ? '-' : '+'}
            </button>
         </div>

         {showQuestsView ? renderQuests : null}
      </div>
   );
};
