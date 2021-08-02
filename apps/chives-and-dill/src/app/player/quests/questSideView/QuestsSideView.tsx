import React, { useEffect, useState } from 'react';
import styles from "./QuestsSideView.module.scss";
import { useSelector } from 'react-redux';
import { selectQuests } from '../../../../stores';
import _ from 'lodash';

export const QuestsSideView = () => {

    const quests = useSelector(selectQuests);
    const [showQuestsView, updateShowQuestsView] = useState(false);

    useEffect(()=> {
        
    }, [quests])

    const renderQuests = _.map(quests, (quest, i) => {

        const {name, questStage} = quest;
       
        if(quest.questStage) {
            console.log(quest.questStage.stageParts[4])
        }
        return (
            <div key={i}> 
                <div className={styles.questTitle}>
                    {name}
                </div>
                <div className={styles.questDesc}>
                    {/* {questStage.stageParts ? questStage.stageParts[4].amount : null} */}
                </div>
            </div>
        )
    })

    return (
        <div className={styles.questsSideViewContainer}>
            <div className={styles.sectionTitleContainer}>
                <div className={styles.sectionTitle}>Quests</div>
                <button className={styles.questViewToggle} onClick={() => updateShowQuestsView(!showQuestsView)}>
                    {showQuestsView ? "-" : "+"}
                </button>
            </div>
            
            {showQuestsView ? renderQuests : null}
        </div>
    )
}