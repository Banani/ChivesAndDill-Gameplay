import _ from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import {
   getActiveConversation,
   getNpcQuests,
   getQuestDefinition,
   selectActiveCharacterId,
   selectCharacters,
} from '../../../stores/engineStateModule/selectors';
import styles from './NpcModal.module.scss';

export const NpcModal = () => {
   const activeConversation = useSelector(getActiveConversation);
   const activePlayerId = useSelector(selectActiveCharacterId);
   const players = useSelector(selectCharacters);
   const questDefinition = useSelector(getQuestDefinition);
   const npcQuests = useSelector(getNpcQuests);

   const activeNpc = players[activeConversation[activePlayerId]?.npcId];
   const activeNpcQuests = npcQuests[activeNpc?.templateId];

   return activeNpc ? (
      <div className={styles.NpcModal}>
         <img className={styles.Avatar} src={activeNpc.avatar} alt={''} />
         <div className={styles.Name}>{activeNpc.name}</div>
         <div className={styles.ContentWrapper}>
            <div className={styles.SectionText}>aaaa aaaaaa aaaaa aaaa aaaaaa aaa aaa aaaaaa aaaaa xDDD :D</div>
            <h3 className={styles.SectionHeader}>Current Quests</h3>
            <h3 className={styles.SectionHeader}>Available Quests</h3>
            {_.map(activeNpcQuests, (_, questId) => (
               <>{questDefinition[questId].name}</>
            ))}
         </div>
      </div>
   ) : null;
};
