import { GlobalStoreModule } from '@bananos/types';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import _ from 'lodash';
import React, { useContext, useState } from 'react';
import questionMark from '../../../../../assets/spritesheets/questNpc/questionMark.png';
import { SelectedQuestProviderContext } from '../../contexts/SelectedQuestProvider';
import { QuestStagePart } from '../questStagePart/QuestStagePart';
import styles from './QuestsSideView.module.scss';

export const QuestsSideView = () => {
   const { setSelectedQuestId } = useContext(SelectedQuestProviderContext);
   const { data: questProgress } = useEngineModuleReader(GlobalStoreModule.QUEST_PROGRESS);
   const { data: questDefinition } = useEngineModuleReader(GlobalStoreModule.QUEST_DEFINITION);

   const [showQuestsView, updateShowQuestsView] = useState(true);

   let questsCounter = 0;

   const renderQuests = _.map(questProgress, (currentQuestProgress, questId) => {
      const questStage = questDefinition[questId]?.stages[currentQuestProgress.activeStage];
      if (!currentQuestProgress.allStagesCompleted) {
         questsCounter++;
      }

      return (
         <div className={styles.questMainContainer} key={questId}>
            {currentQuestProgress.allStagesCompleted ? (
               <div className={styles.questionMarkContainer} onClick={() => setSelectedQuestId(questId)}>
                  <img src={questionMark} className={styles.questionMark} />
               </div>
            ) : (
               <div className={styles.questionMarkContainer} onClick={() => setSelectedQuestId(questId)}>
                  {questsCounter}
               </div>
            )}
            <div className={styles.questDefinitionContainer}>
               <div className={styles.questTitle} onClick={() => setSelectedQuestId(questId)}>
                  {questDefinition[questId]?.name}
               </div>
               <div className={styles.questDesc}>
                  {!currentQuestProgress.allStagesCompleted ? (
                     _.map(questStage?.stageParts, (stagePart, stagePartId) => (
                        <div>
                           <QuestStagePart
                              questStagePart={stagePart}
                              stagePartProgress={currentQuestProgress.stagesProgress[currentQuestProgress.activeStage][stagePartId]}
                           />
                        </div>
                     ))
                  ) : (
                     <div className={styles.stagePartDone}>Ready for turn-in</div>
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
            <button className={styles.questViewToggle} onClick={() => updateShowQuestsView(!showQuestsView)}>
               {showQuestsView ? '-' : '+'}
            </button>
         </div>
         {showQuestsView ? renderQuests : null}
      </div>
   );
};
