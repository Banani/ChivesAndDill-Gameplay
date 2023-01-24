import type { QuestSchema } from '@bananos/types';
import { GlobalStoreModule } from '@bananos/types';
import { EngineApiContext } from 'apps/chives-and-dill/src/contexts/EngineApi';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import type { FunctionComponent } from 'react';
import React, { useCallback, useContext, useState } from 'react';
import { Button } from '../components/button/Button';
import { AvailableQuestNpcModal, CompleteQuestNpcModal, DefaultNpcModal, TradeNpcModal } from './components';
import styles from './NpcModal.module.scss';

enum NpcModalView {
   Default,
   AvailableQuest,
   CompletedQuest,
   Trade,
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
      }, [activeNpc.id, activeQuestId, context]);

      const completeQuest = useCallback(() => {
         context.finalizeQuestWithNpc({ npcId: activeNpc.id, questId: activeQuestId });
         setCurrentModal(NpcModalView.Default);
         setActiveQuestId(null);
      }, [activeNpc.id, activeQuestId, context]);

      const closeButtonHandler = () => {
         if (currentModal !== NpcModalView.Default) {
            setCurrentModal(NpcModalView.Default);
         } else {
            context.closeNpcConversationDialog();
         }
      };

      return (
         <div className={styles.NpcModal}>
            <div className={styles.ModalHeader}>
               <img className={styles.Avatar} src={activeNpc.avatar} alt={''} />
               <div className={styles.Name}>{activeNpc.name}</div>
               <Button className={styles.closeButton} onClick={closeButtonHandler}>
                  X
               </Button>
            </div>
            {currentModal === NpcModalView.Default && (
               <DefaultNpcModal
                  openQuest={(questId) => {
                     setCurrentModal(questProgress?.[questId] ? NpcModalView.CompletedQuest : NpcModalView.AvailableQuest);
                     setActiveQuestId(questId);
                  }}
                  setCurrentModal={setCurrentModal}
                  NpcModalView={NpcModalView}
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
            {currentModal === NpcModalView.Trade && (
               <TradeNpcModal
                  close={() => setCurrentModal(NpcModalView.Default)}
               />
            )}
         </div>
      );
   },
   (oldProps, newProps) => oldProps.activeNpc.id === newProps.activeNpc.id
);
