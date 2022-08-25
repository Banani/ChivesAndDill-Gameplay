import { GlobalStoreModule, QuestSchema } from '@bananos/types';
import { EngineApiContext } from 'apps/chives-and-dill/src/contexts/EngineApi';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import React, { FunctionComponent, useCallback, useContext, useState } from 'react';
import { AvailableQuestNpcModal, CompleteQuestNpcModal, DefaultNpcModal } from './components';
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
      const { data: questProgress } = useEngineModuleReader(GlobalStoreModule.QUEST_PROGRESS);
      const [currentModal, setCurrentModal] = useState(NpcModalView.Default);
      const [activeQuestId, setActiveQuestId] = useState(null);
      const context = useContext(EngineApiContext);

      const acceptQuest = useCallback(() => {
         context.takeQuestFromNpc({ npcId: activeNpc.id, questId: activeQuestId });
         setCurrentModal(NpcModalView.Default);
         setActiveQuestId(null);
      }, [activeNpc.id, activeQuestId]);

      const completeQuest = useCallback(() => {
         context.finalizeQuestWithNpc({ npcId: activeNpc.id, questId: activeQuestId });
         setCurrentModal(NpcModalView.Default);
         setActiveQuestId(null);
      }, [activeNpc.id, activeQuestId]);

      return (
         <div className={styles.NpcModal}>
            <div>
               <img className={styles.Avatar} src={activeNpc.avatar} alt={''} />
               <div className={styles.Name}>{activeNpc.name}</div>
            </div>
            {currentModal === NpcModalView.Default && (
               <DefaultNpcModal
                  openQuest={(questId) => {
                     setCurrentModal(questProgress?.[questId] ? NpcModalView.CompletedQuest : NpcModalView.AvailableQuest);
                     setActiveQuestId(questId);
                  }}
               />
            )}
            {currentModal === NpcModalView.AvailableQuest && (
               <AvailableQuestNpcModal
                  close={() => setCurrentModal(NpcModalView.Default)}
                  acceptQuest={acceptQuest}
                  questSchema={questDefinition[activeQuestId]}
               />
            )}
            {currentModal === NpcModalView.CompletedQuest && (
               <CompleteQuestNpcModal
                  close={() => setCurrentModal(NpcModalView.Default)}
                  questSchema={questDefinition[activeQuestId]}
                  completeQuest={completeQuest}
                  questId={activeQuestId}
               />
            )}
         </div>
      );
   },
   (oldProps, newProps) => oldProps.activeNpc.id === newProps.activeNpc.id
);
