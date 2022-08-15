import { getActiveConversation, getNpcQuests, getQuestDefinition, selectActiveCharacterId, selectCharacters } from 'apps/chives-and-dill/src/stores';
import _ from 'lodash';
import type { FunctionComponent } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import styles from './DefaultNpcModal.module.scss';

interface DefaultNpcModalProps {
   openQuest: (questId: string) => void;
}

export const DefaultNpcModal: FunctionComponent<DefaultNpcModalProps> = ({ openQuest }) => {
   const activeConversation = useSelector(getActiveConversation);
   const activePlayerId = useSelector(selectActiveCharacterId);
   const players = useSelector(selectCharacters);
   const questDefinition = useSelector(getQuestDefinition);
   const npcQuests = useSelector(getNpcQuests);

   const activeNpc = players[activeConversation[activePlayerId]?.npcId];
   const activeNpcQuests = npcQuests[activeNpc?.templateId];

   return activeNpc ? (
      <>
         <div className={styles.SectionText}>aaaa aaaaaa aaaaa aaaa aaaaaa aaa aaa aaaaaa aaaaa xDDD :D</div>
         <h3 className={styles.SectionHeader}>Current Quests</h3>
         <h3 className={styles.SectionHeader}>Available Quests</h3>
         {_.map(activeNpcQuests, (_, questId) => (
            <div className={styles.questName}
               onClick={() => {
                  openQuest(questId);
               }}
            >
               {questDefinition[questId].name}
            </div>
         ))}
      </>
   ) : null;
};
