import { QuestSchema } from '@bananos/types';
import { EngineApiContext } from 'apps/chives-and-dill/src/contexts/EngineApi';
import React, { FunctionComponent, useCallback, useContext, useState } from 'react';
import { AvailableQuestNpcModal, DefaultNpcModal } from './components';
import styles from './NpcModal.module.scss';

enum NpcModalView {
   Default,
   AvailableQuest,
   CompletedQuest,
}

export interface NpcModalProps {
   activeNpc: any; // TODO: poprawic
   questDefinition: Record<string, QuestSchema>;
}

export const NpcModal: FunctionComponent<NpcModalProps> = React.memo(
   ({ activeNpc, questDefinition }) => {
      const [currentModal, setCurrentModal] = useState(NpcModalView.Default);
      const [activeQuestId, setActiveQuestId] = useState(null);
      const context = useContext(EngineApiContext);

      const acceptQuest = useCallback(() => {
         context.takeQuestFromNpc({ npcId: activeNpc.id, questId: activeQuestId });
      }, [activeNpc.id, activeQuestId]);

      return (
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
               {currentModal === NpcModalView.AvailableQuest && (
                  <AvailableQuestNpcModal acceptQuest={acceptQuest} questSchema={questDefinition[activeQuestId]} />
               )}
            </div>
         </div>
      );
   },
   (oldProps, newProps) => oldProps.activeNpc.id === newProps.activeNpc.id
);
