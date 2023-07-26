import { GlobalStoreModule, type QuestSchema } from '@bananos/types';
import { useEngineModuleReader, useItemTemplateProvider } from 'apps/chives-and-dill/src/hooks';
import { map } from 'lodash';
import type { FunctionComponent } from 'react';
import React, { useMemo } from 'react';
import { MoneyBar } from '../../../moneyBar/MoneyBar';
import { QuestStagePart } from '../questStagePart';

import styles from './QuestDescription.module.scss';
import { ItemPreview, ItemPreviewHighlight } from 'apps/chives-and-dill/src/components/itemPreview/ItemPreview';
import _ from 'lodash';

interface QuestDescriptionProps {
    questSchema: QuestSchema;
}

export const QuestDescription: FunctionComponent<QuestDescriptionProps> = ({ questSchema }) => {
    const { itemTemplates } = useItemTemplateProvider({ itemTemplateIds: map(questSchema.questReward.items, (item) => item.itemTemplateId) ?? [] });
    const { data: questProgress } = useEngineModuleReader(GlobalStoreModule.QUEST_PROGRESS);

    const items = useMemo(
        () =>
            map(questSchema.questReward.items, (item) => {
                const itemData = itemTemplates[item.itemTemplateId];
                if (itemData) {
                    return (
                        <div className={styles.ItemContainer}>
                            <ItemPreview
                                itemData={itemData}
                                showMoney={false}
                                highlight={ItemPreviewHighlight.none}
                            />
                        </div>
                    );
                }
            }),
        [questSchema.questReward.items, itemTemplates]
    );

    const renderQuests = _.map(questProgress, (currentQuestProgress) => {
        const questStage = questSchema.stages[currentQuestProgress.activeStage];

        return (
            <div className={styles.questDesc}>
                {_.map(questStage?.stageParts, (stagePart, stagePartId) => {

                    return (
                        <div className={currentQuestProgress.stagesProgress[currentQuestProgress.activeStage][stagePartId].isDone ? styles.stagePartDone : ''}>
                            <QuestStagePart
                                questStagePart={stagePart}
                                stagePartProgress={currentQuestProgress.stagesProgress[currentQuestProgress.activeStage][stagePartId]}
                            />
                        </div>
                    )
                })}
            </div>
        )
    });

    return (
        <>
            <h3 className={styles.SectionHeader}>{questSchema.name}</h3>
            <div className={styles.SectionText}>{questSchema.description}</div>
            <h3 className={styles.SectionHeader}>Quests Objectives</h3>
            {renderQuests}
            <h3 className={styles.SectionHeader}>Rewards</h3>
            {items && <div className={styles.ItemsContainer}>{items}</div>}
            {questSchema.questReward.currency && (
                <div className={styles.MoneyReward}>
                    You will also receive:
                    <MoneyBar currency={questSchema.questReward.currency} />
                </div>
            )}
            <div className={styles.ExperienceReward}>
                Experience: <div className={styles.ExperienceAmount}>{questSchema.questReward.experience}</div>
            </div>
        </>
    );
};
