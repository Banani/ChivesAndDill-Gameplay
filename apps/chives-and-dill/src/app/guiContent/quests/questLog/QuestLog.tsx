import React, { useEffect, useState } from 'react';
import styles from "./QuestLog.module.scss";
import { useSelector, useDispatch } from 'react-redux';
import { selectQuests, selectActiveQuestDetails, activeQuestDetailsUpdate } from '../../../../stores';
import _ from 'lodash';

export const QuestLog = () => {

  const dispatch = useDispatch();
  const quests = useSelector(selectQuests);
  const activeQuestDetails = useSelector(selectActiveQuestDetails);
  const [activeQuest, setActiveQuest] = useState({});

  useEffect(() => {
    setActiveQuest(activeQuestDetails);
  }, [activeQuestDetails]);

  const renderQuests = _.map(quests, (quest, i) => (
    <div key={i}>
      <div className={`${styles.QuestTitle} ${quest === activeQuest ? styles.ActiveTitle : ''}`} onClick={() => setActiveQuest(quest)}>
        {quest.name}
      </div>
    </div>
  ));

  const questsStagesInfo = (questStage) => {

    const renderQuestStages = _.map(questStage.stageParts, (stage) => {
      if (stage.type === 0) {
        return (
          <div key={stage.id}>
            <div>{stage.description}</div>
            <div>- x: {stage.targetLocation.x}</div>
            <div>- y: {stage.targetLocation.y}</div>
          </div>
        )
      }
      if (stage.type === 1) {
        return (
          <div key={stage.id}>
            <div>{stage.description}</div>
            <div>- {stage.currentProgress ? stage.currentProgress : 0} / {stage.amount}</div>
          </div>
        )
      }
    });

    return (
      <div className={styles.questDesc}>
        <div className={styles.activeQuestTitle}>Progress</div>
        {renderQuestStages}
      </div>
    )
  }

  const questDetails = (quest) => <div key={quest.id} >
    <div className={styles.QuestDesc}>
      <div className={styles.activeQuestTitle}> {quest.name} </div>
      <div className={styles.activeQuestDesc}>{quest.questStage?.description}</div>
      {questsStagesInfo(quest.questStage)}
      <div className={styles.activeQuestTitle}>{quest.questStage ? "Description" : null}</div>
      <div className={styles.activeQuestDesc}> {quest.description}</div>
    </div>
  </div >;

  return Object.keys(activeQuest).length ? (
    <div className={styles.QuestLog}>
      <div className={styles.QuestList}>
        {renderQuests ? renderQuests : null}
      </div>
      <div className={styles.QuestDetails}>
        {activeQuest ? questDetails(activeQuest) : null}
      </div>
      <button className={styles.closeWindow} onClick={() => dispatch(activeQuestDetailsUpdate({}))}>x</button>
    </div>
  ) : null;
};