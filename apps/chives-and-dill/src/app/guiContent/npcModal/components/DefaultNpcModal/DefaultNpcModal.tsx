import { useEnginePackageProvider } from 'apps/chives-and-dill/src/hooks';
import _ from 'lodash';
import type { FunctionComponent } from 'react';
import React from 'react';
import styles from './DefaultNpcModal.module.scss';

interface DefaultNpcModalProps {
   openQuest: (questId: string) => void;
}

export const DefaultNpcModal: FunctionComponent<DefaultNpcModalProps> = ({ openQuest }) => {
   const { activeCharacterId, activeConversation, characters, questDefinition, npcQuests, questProgress } = useEnginePackageProvider();

   const activeNpc = characters[activeConversation[activeCharacterId]?.npcId];
   const activeNpcQuests = npcQuests[activeNpc?.templateId];

   const questItem = (questId) => {
      return (
         <div
            className={styles.questName}
            onClick={() => {
               openQuest(questId);
            }}
         >
            {questDefinition[questId]?.name}
         </div>
      );
   };

   return activeNpc ? (
      <div className={styles.ContentWrapper}>
         <div className={styles.SectionText}>aaaa aaaaaa aaaaa aaaa aaaaaa aaa aaa aaaaaa aaaaa xDDD :D</div>
         <h3 className={styles.SectionHeader}>Current Quests</h3>
         {_.chain(activeNpcQuests)
            .pickBy((_, questId) => questProgress?.[questId])
            .map((_, questId) => questItem(questId))
            .value()}
         <h3 className={styles.SectionHeader}>Available Quests</h3>
         {_.chain(activeNpcQuests)
            .pickBy((_, questId) => !questProgress?.[questId])
            .map((_, questId) => questItem(questId))
            .value()}
      </div>
   ) : null;
};
