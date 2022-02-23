import React, { useState } from 'react';
import styles from "./QuestsSideView.module.scss";
import { useSelector, useDispatch } from 'react-redux';
import { selectQuests } from '../../../../stores';
import { activeQuestDetailsUpdate } from "../../../../stores";
import _ from 'lodash';

export const QuestsSideView = () => {

    const dispatch = useDispatch();
    const quests = useSelector(selectQuests);
    const [showQuestsView, updateShowQuestsView] = useState(false);

    const renderQuests = _.map(quests, (quest, i) => {

        const { name, questStage } = quest;
        let renderQuestStages;

        if (questStage) {
            renderQuestStages = _.map(questStage.stageParts, (stage) => {
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
        }

        return (
            <div key={i}>
                <div className={styles.questTitle} onClick={() => dispatch(activeQuestDetailsUpdate(quest))}>
                    {name}
                </div>
                <div className={styles.questDesc}>
                    {renderQuestStages}
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