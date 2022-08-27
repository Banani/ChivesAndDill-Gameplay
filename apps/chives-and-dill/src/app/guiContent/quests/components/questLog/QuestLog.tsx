import { GlobalStoreModule } from '@bananos/types';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import _ from 'lodash';
import React, { useContext } from 'react';
import { SelectedQuestProviderContext } from '../../contexts/SelectedQuestProvider';
import { QuestDescription } from '../questDescription';

import styles from './QuestLog.module.scss';

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
