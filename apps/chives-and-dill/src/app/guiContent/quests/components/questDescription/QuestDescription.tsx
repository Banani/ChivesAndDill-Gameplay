import type { QuestSchema } from '@bananos/types';
import { useItemTemplateProvider } from 'apps/chives-and-dill/src/hooks';
import { map } from 'lodash';
import type { FunctionComponent } from 'react';
import React, { useMemo } from 'react';
import { MoneyBar } from '../../../moneyBar/MoneyBar';
import { QuestStagePart } from '../questStagePart';

import styles from './QuestDescription.module.scss';

interface QuestDescriptionProps {
    questSchema: QuestSchema;
}

export const QuestDescription: FunctionComponent<QuestDescriptionProps> = ({ questSchema }) => {
    const { itemTemplates } = useItemTemplateProvider({ itemTemplateIds: map(questSchema.questReward.items, (item) => item.itemTemplateId) ?? [] });

    const items = useMemo(
        () =>
            map(questSchema.questReward.items, (item) => {
                const itemData = itemTemplates[item.itemTemplateId];
                if (itemData) {
                    return (
                        <div className={styles.Item}>
                            <img src={itemData.image} className={styles.ItemImage} alt=""></img>
                            <div className={styles.Stack}>{itemData.stack}</div>
                            <div className={styles.RewardText}>{itemData.name}</div>
                        </div>
                    );
                }
            }),
        [questSchema.questReward.items, itemTemplates]
    );

    return (
        <>
            <h3 className={styles.SectionHeader}>{questSchema.name}</h3>
            <div className={styles.SectionText}>{questSchema.description}</div>
            <h3 className={styles.SectionHeader}>Quests Objectives</h3>
            {map(questSchema.stages[questSchema.stageOrder[0]].stageParts, (stagePart) => (
                <div className={styles.SectionText}>
                    <QuestStagePart questStagePart={stagePart} />
                </div>
            ))}

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
