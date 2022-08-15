import { QuestSchema } from '@bananos/types';
import React, { FunctionComponent } from 'react';
import { useItemTemplateProvider } from '../../../../../hooks';
import styles from './AvailableQuestNpcModal.module.scss';

interface AvailableQuestNpcModalProps {
   questSchema: QuestSchema;
}

export const AvailableQuestNpcModal: FunctionComponent<AvailableQuestNpcModalProps> = ({ questSchema }) => {
   const { itemTemplates } = useItemTemplateProvider({ itemTemplateIds: questSchema.questReward.items?.map((item) => item.itemTemplateId) ?? [] });
   // Tylko one przez chwile beda undefined, zaladuja sie dopiero po chwili

   const items = questSchema.questReward.items.map((item) => {
      <div className={styles.ItemsContainer}>
         <div className={styles.Item}></div>
      </div>;
   });

   return (
      <div>
         <h3 className={styles.SectionHeader}>{questSchema.name}</h3>
         <div className={styles.SectionText}>{questSchema.description}</div>
         <h3 className={styles.SectionHeader}>Quests Objectives</h3>
         <div className={styles.SectionText}>Kill 6 Young Nightsabers</div>
         <h3 className={styles.SectionHeader}>Rewards</h3>
         <h3 className={styles.SectionHeader}>Rewards</h3>
         <h3 className={styles.SectionHeader}>Rewards</h3>
         <h3 className={styles.SectionHeader}>Rewards</h3>
         <div className={styles.SectionText}>{items}</div>
         <div className={styles.SectionText}>You will also receive {questSchema.questReward.currency}</div>
         <div className={styles.SectionText}>Experience {questSchema.questReward.experience}</div>
      </div>
   );
};
