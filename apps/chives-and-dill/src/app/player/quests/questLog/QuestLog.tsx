import React, { useState } from 'react';
import styles from "./QuestLog.module.scss";
import { useSelector } from 'react-redux';
import { selectQuests } from '../../../../stores';
import _ from 'lodash';

export const QuestLog = (props) => {

  const [activeQuest, setActiveQuest] = useState({});
  const quests = useSelector(selectQuests);

  const renderQuests = _.map(quests, (quest, i) => (
    <div key={i}>
      <div className={styles.QuestTitle} onClick={() => setActiveQuest(quest)}>
        {quest.name}
      </div>
    </div>
  ));

  const questDetails = (quest) => (
    <div key={quest.id} >
      <div className={styles.QuestDesc}>
        <div className={styles.activeQuestTitle}> {quest.name} </div>
        <div className={styles.activeQuestDesc}>{quest.questStage?.description}</div>
        <div className={styles.activeQuestTitle}>{quest.questStage ? "Description" : null}</div>
        <div className={styles.activeQuestDesc}> {quest.description} </div>
      </div>
    </div >
  );

  return (props.trigger) ? (
    <div className={styles.QuestLog}>
      <div className={styles.QuestList}>
        {renderQuests ? renderQuests : null}
      </div>
      <div className={styles.QuestDetails}>
        {activeQuest ? questDetails(activeQuest) : null}
      </div>
      <button className={styles.closeWindow} onClick={() => props.setTrigger(false)}>x</button>
    </div>
  ) : null;
};