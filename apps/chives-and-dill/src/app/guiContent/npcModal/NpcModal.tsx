import type { QuestSchema } from '@bananos/types';
import { GlobalStoreModule } from '@bananos/types';
import { EngineApiContext } from 'apps/chives-and-dill/src/contexts/EngineApi';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import type { FunctionComponent } from 'react';
import React, { useCallback, useContext, useState } from 'react';
import { AvailableQuestNpcModal, CompleteQuestNpcModal, DefaultNpcModal, TradeNpcModal } from './components';

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

      const closeNpcModal = () => {
         console.log(":D")
         if (currentModal !== NpcModalView.Default && currentModal !== NpcModalView.Trade) {
            setCurrentModal(NpcModalView.Default);
         } else {
            context.closeNpcConversationDialog();
         }
      };

      return (
         <>
            {currentModal === NpcModalView.Default && (
               <DefaultNpcModal
                  openQuest={(questId) => {
                     setCurrentModal(questProgress?.[questId] ? NpcModalView.CompletedQuest : NpcModalView.AvailableQuest);
                     setActiveQuestId(questId);
                  }}
                  setCurrentModal={setCurrentModal}
                  NpcModalView={NpcModalView}
                  closeNpcModal={closeNpcModal}
               />
            )}
            {currentModal === NpcModalView.AvailableQuest && (
               <AvailableQuestNpcModal
                  close={() => setCurrentModal(NpcModalView.Default)}
                  acceptQuest={acceptQuest}
                  questSchema={questDefinition[activeQuestId]}
                  closeNpcModal={closeNpcModal}
               />
            )}
            {currentModal === NpcModalView.CompletedQuest && (
               <CompleteQuestNpcModal
                  close={() => setCurrentModal(NpcModalView.Default)}
                  questSchema={questDefinition[activeQuestId]}
                  completeQuest={completeQuest}
                  questId={activeQuestId}
                  closeNpcModal={closeNpcModal}
               />
            )}
            {currentModal === NpcModalView.Trade && (
               <TradeNpcModal />
            )}
         </>
      );
   },
   (oldProps, newProps) => oldProps.activeNpc.id === newProps.activeNpc.id
);
