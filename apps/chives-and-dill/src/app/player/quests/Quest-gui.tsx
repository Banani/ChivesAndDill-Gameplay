import React from 'react';
import styles from "./QuestLog.module.scss";
import { useSelector } from 'react-redux';
import { selectQuests } from '../../../stores';
import _ from 'lodash';

export default function QuestLog(props){
  const [questOpen, setQuestOpen]=React.useState(false);
  const quests = useSelector(selectQuests);
  const renderQuests = _.map(quests, (quest, i) => (
    <div key={i}>
      <div className={styles.QuestTitle} onClick={()=>setQuestOpen(!questOpen)}>
        {quest.name}
      </div>
    </div>
  ));

  const renderQuestDetails = _.map(quests, (quest, i) => (
    <div key={i}>
      <div className={styles.QuestDesc}>
        <h1> {quest.name} </h1>
        <p> {quest.description} </p>
      </div>
    </div>
  ));
 
  return(props.trigger) ? (
    <div className={styles.QuestLog}>
       <div className={styles.QuestList}>
          { renderQuests ? renderQuests : null }
        </div>
        <div className={styles.QuestDetails}>
          { questOpen ? renderQuestDetails : null }
        </div>
        <button className={styles.closeWindow} onClick={()=>props.setTrigger(false)}>x</button>
        {props.children}
    </div>
  ) : null;
};