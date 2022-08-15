import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { getActiveConversation, getQuestDefinition, selectActiveCharacterId, selectCharacters } from '../../../stores/engineStateModule/selectors';
import { AvailableQuestNpcModal, DefaultNpcModal } from './components';
import styles from './NpcModal.module.scss';

enum NpcModalView {
   Default,
   AvailableQuest,
   CompletedQuest,
}

export const NpcModal = () => {
   const [currentModal, setCurrentModal] = useState(NpcModalView.Default);
   const activeConversation = useSelector(getActiveConversation);
   const activePlayerId = useSelector(selectActiveCharacterId);
   const players = useSelector(selectCharacters);
   const questDefinition = useSelector(getQuestDefinition);

   const activeNpc = players[activeConversation[activePlayerId]?.npcId];

   const [activeQuestId, setActiveQuestId] = useState(null);

   return activeNpc ? (
      <div className={styles.NpcModal}>
         <img className={styles.Avatar} src={activeNpc.avatar} alt={''} />
         <div className={styles.Name}>{activeNpc.name}</div>
         <div className={styles.ContentWrapper}>
            {currentModal === NpcModalView.Default && (
               <DefaultNpcModal
                  openQuest={(questId) => {
                     setCurrentModal(NpcModalView.AvailableQuest);
                     setActiveQuestId(questId);
                  }}
               />
            )}
            {currentModal === NpcModalView.AvailableQuest && <AvailableQuestNpcModal questSchema={questDefinition[activeQuestId]} />}
         </div>
      </div>
   ) : null;
};
