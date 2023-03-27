import { GlobalStoreModule } from '@bananos/types';
import { EngineApiContext } from 'apps/chives-and-dill/src/contexts/EngineApi';
import { KeyBoardContext } from 'apps/chives-and-dill/src/contexts/KeyBoardContext';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import _ from 'lodash';
import type { FunctionComponent } from 'react';
import React, { useContext, useEffect } from 'react';
import styles from './DefaultNpcModal.module.scss';
import { ModalHeader } from '../ModalHeader/ModalHeader';

interface DefaultNpcModalProps {
   openQuest: (questId: string) => void;
   setCurrentModal: any;
   NpcModalView: any;
   closeButtonHandler: any;
}

interface ActiveNpc {
   avatar: string;
   name: string;
}

export const DefaultNpcModal: FunctionComponent<DefaultNpcModalProps> = ({ openQuest, setCurrentModal, NpcModalView, closeButtonHandler }) => {
   const { activeCharacterId } = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER).data;
   const { data: activeConversation } = useEngineModuleReader(GlobalStoreModule.NPC_CONVERSATION);
   const { data: characters } = useEngineModuleReader(GlobalStoreModule.CHARACTER);
   const { data: questDefinition } = useEngineModuleReader(GlobalStoreModule.QUEST_DEFINITION);
   const { data: npcQuests } = useEngineModuleReader(GlobalStoreModule.NPC_QUESTS);
   const { data: questProgress } = useEngineModuleReader(GlobalStoreModule.QUEST_PROGRESS);

   const activeNpc = characters[activeConversation[activeCharacterId]?.npcId] as any;
   const activeNpcQuests = npcQuests[activeNpc?.templateId];

   const keyBoardContext = useContext(KeyBoardContext);
   const engineApiContext = useContext(EngineApiContext);

   useEffect(() => {
      keyBoardContext.addKeyHandler({
         id: 'DefaultNpcModalEscape',
         matchRegex: 'Escape',
         keydown: engineApiContext.closeNpcConversationDialog,
      });

      return () => {
         keyBoardContext.removeKeyHandler('AvailableQuestNpcModalEscape');
      };
   }, []);

   const questItem = (questId) => (
      <div
         className={styles.questName}
         onClick={() => {
            openQuest(questId);
         }}
      >
         {questDefinition[questId]?.name}
      </div>
   );

   const currentQuests = (
      _.chain(activeNpcQuests)
         .pickBy((_, questId) => questProgress?.[questId])
         .map((_, questId) => questItem(questId))
         .value()
   );

   const availableQuests = (
      _.chain(activeNpcQuests)
         .pickBy((_, questId) => !questProgress?.[questId])
         .map((_, questId) => questItem(questId))
         .value()
   );

   return activeNpc ? (
      <div className={styles.NpcModal}>
         {/* <ModalHeader activeNpc={activeNpc} closeButtonHandler={closeButtonHandler} /> */}
         <div className={styles.ContentWrapper}>
            <div className={styles.SectionText}>Cześć!</div>
            {activeNpc.stock ? <div className={styles.TradeModal} onClick={() => setCurrentModal(NpcModalView.Trade)}>Show me your wares.</div> : null}
            {currentQuests.length > 0 ? <h3 className={styles.SectionHeader}>Current Quests</h3> : null}
            {currentQuests}
            {availableQuests.length > 0 ? <h3 className={styles.SectionHeader}>Available Quests</h3> : null}
            {availableQuests}
         </div>
      </div>
   ) : null;
};
