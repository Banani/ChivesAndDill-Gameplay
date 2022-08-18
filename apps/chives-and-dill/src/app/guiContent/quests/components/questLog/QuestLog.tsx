import { useEnginePackageProvider } from 'apps/chives-and-dill/src/hooks';
import _ from 'lodash';
import React, { useContext } from 'react';
import { SelectedQuestProviderContext } from '../../contexts/SelectedQuestProvider';
import { QuestDescription } from '../questDescription';

import styles from './QuestLog.module.scss';

export const QuestLog = () => {
   const { questProgress, questDefinition } = useEnginePackageProvider();
   const { selectedQuestId, setSelectedQuestId } = useContext(SelectedQuestProviderContext);

   const renderQuests = _.map(questProgress, (quest, questId) => (
      <div key={questId}>
         <div className={`${styles.QuestTitle} ${questId === selectedQuestId ? styles.ActiveTitle : ''}`} onClick={() => setSelectedQuestId(questId)}>
            {questDefinition[questId].name}
         </div>
      </div>
   ));

   //    const questDetails = () => (
   //       <div key={selectedQuestId}>
   //          <div className={styles.QuestDesc}>
   //             <div className={styles.activeQuestTitle}> {questDefinition[selectedQuestId].name} </div>
   //             {/* <div className={styles.activeQuestDesc}>{quest.questStage?.description}</div> */}
   //             {/* {questsStagesInfo(quest.questStage)} */}
   //             {/* <div className={styles.activeQuestTitle}>{quest.questStage ? 'Description' : null}</div> */}
   //             <div className={styles.activeQuestDesc}> {questDefinition[selectedQuestId].description}</div>
   //          </div>
   //       </div>
   //    );

   return selectedQuestId ? (
      <div className={styles.QuestLog}>
         <div className={styles.QuestList}>{renderQuests ? renderQuests : null}</div>
         <div className={styles.QuestDetails}>
            <QuestDescription questSchema={questDefinition[selectedQuestId]} />
         </div>
         <button className={styles.closeWindow} onClick={() => setSelectedQuestId(null)}>
            x
         </button>
      </div>
   ) : null;
};
