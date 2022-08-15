import type { QuestSchema } from '@bananos/types';
import type { FunctionComponent } from 'react';
import React from 'react';
import { useItemTemplateProvider } from '../../../../../hooks';
import { MoneyBar } from '../../../moneyBar/MoneyBar';
import styles from './AvailableQuestNpcModal.module.scss';

interface AvailableQuestNpcModalProps {
   questSchema: QuestSchema;
}

export const AvailableQuestNpcModal: FunctionComponent<AvailableQuestNpcModalProps> = ({ questSchema }) => {
   const { itemTemplates } = useItemTemplateProvider({ itemTemplateIds: questSchema.questReward.items?.map((item) => item.itemTemplateId) ?? [] });

   const items = questSchema.questReward.items.map((item) => {
      const itemData = itemTemplates[item.itemTemplateId];
      if (itemData) {
         return (
            <div className={styles.Item}>
               <img src={itemData.image} className={styles.ItemImage} alt=''></img>
               <div className={styles.Stack}>{itemData.stack}</div>
               <div className={styles.RewardText}>{itemData.name}</div>
            </div>
         );
      }
   });

   return (
      <div>
         <h3 className={styles.SectionHeader}>{questSchema.name}</h3>
         <div className={styles.SectionText}>{questSchema.description}</div>
         <h3 className={styles.SectionHeader}>Quests Objectives</h3>
         <div className={styles.SectionText}>Kill 6 Young Nightsabers</div>
         <h3 className={styles.SectionHeader}>Rewards</h3>
         <div className={styles.ItemsContainer}>{items}</div>
         <div className={styles.MoneyReward}>You will also receive:
            <MoneyBar currency={questSchema.questReward.currency} />
         </div>
         <div className={styles.ExperienceReward}>
            Experience: <div className={styles.ExperienceAmount}>{questSchema.questReward.experience}</div>
         </div>
      </div>
   );
};
