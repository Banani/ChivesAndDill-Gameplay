import { GlobalStoreModule, NpcClientActions } from '@bananos/types';
import { EngineContext } from 'apps/chives-and-dill/src/contexts/EngineApiContext';
import { KeyBoardContext } from 'apps/chives-and-dill/src/contexts/KeyBoardContext';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import _ from 'lodash';
import type { FunctionComponent } from 'react';
import React, { useContext, useEffect } from 'react';
import { NpcModalView } from '../../NpcModal';
import { ModalHeader } from '../ModalHeader/ModalHeader';
import styles from './DefaultNpcModal.module.scss';
import questionMarkGray from '../../../../../assets/spritesheets/questNpc/questionMarkGray.png';
import exclamationMark from '../../../../../assets/spritesheets/questNpc/exclamationMark.png';
import questionMark from '../../../../../assets/spritesheets/questNpc/questionMark.png';

interface DefaultNpcModalProps {
   openQuest: (questId: string) => void;
   setCurrentModal: any;
   closeNpcModal: () => void;
}

export const DefaultNpcModal: FunctionComponent<DefaultNpcModalProps> = ({ openQuest, setCurrentModal, closeNpcModal }) => {
   const { activeCharacterId } = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER).data;
   const { data: activeConversation } = useEngineModuleReader(GlobalStoreModule.NPC_CONVERSATION);
   const { data: characters } = useEngineModuleReader(GlobalStoreModule.CHARACTER);
   const { data: questDefinition } = useEngineModuleReader(GlobalStoreModule.QUEST_DEFINITION);
   const { data: npcQuests } = useEngineModuleReader(GlobalStoreModule.NPC_QUESTS);
   const { data: questProgress } = useEngineModuleReader(GlobalStoreModule.QUEST_PROGRESS);

   const activeNpc = characters[activeConversation[activeCharacterId]?.npcId];
   const activeNpcQuests = npcQuests[activeNpc?.templateId];

   const keyBoardContext = useContext(KeyBoardContext);
   const { callEngineAction } = useContext(EngineContext);

   useEffect(() => {
      keyBoardContext.addKeyHandler({
         id: 'DefaultNpcModalEscape',
         matchRegex: 'Escape',
         keydown: () => callEngineAction({ type: NpcClientActions.CloseNpcConversationDialog }),
      });

      return () => {
         keyBoardContext.removeKeyHandler('AvailableQuestNpcModalEscape');
      };
   }, []);

   const questItem = (questId) => {
      let icon;
      if (questProgress?.[questId]) {
         icon = <img src={questionMarkGray} alt="currentQuests" />;
      }
      if (!questProgress?.[questId]) {
         icon = <img src={exclamationMark} alt="availableQuests" />;
      }
      if (questProgress?.[questId]?.allStagesCompleted) {
         icon = <img src={questionMark} alt="completeQuest" />;
      }
      return (
         <div
            key={questId}
            className={styles.QuestName}
            onClick={() => {
               openQuest(questId);
            }}
         >
            {icon}
            {questDefinition[questId]?.name}
         </div>
      );
   };

   const currentQuests = _.chain(activeNpcQuests)
      .pickBy((_, questId) => questProgress?.[questId] && !questProgress?.[questId]?.allStagesCompleted)
      .map((_, questId) => questItem(questId))
      .value();

   const availableQuests = _.chain(activeNpcQuests)
      .pickBy((_, questId) => !questProgress?.[questId])
      .map((_, questId) => questItem(questId))
      .value();

   const completeQuest = _.chain(activeNpcQuests)
      .pickBy((_, questId) => questProgress?.[questId]?.allStagesCompleted)
      .map((_, questId) => questItem(questId))
      .value();

   return activeNpc ? (
      <div className={styles.NpcModal}>
         <ModalHeader activeNpc={activeNpc} closeNpcModal={closeNpcModal} />
         <div className={styles.ContentWrapper}>
            <div className={styles.SectionText}>Cześć!</div>
            {!_.isEmpty(activeNpc.stock) ? (
               <div className={styles.TradeModalContainer} onClick={() => setCurrentModal(NpcModalView.Trade)}>
                  <img src="../../../../../assets/spritesheets/icons/tradeIcon.png" />
                  <div className={styles.TradeModal}>Show me your wares.</div>
               </div>
            ) : null}
            {completeQuest.length ? <h3 className={styles.SectionHeader}>Complete Quests</h3> : null}
            <div className={styles.SectionQuests}>{completeQuest}</div>
            {currentQuests.length ? <h3 className={styles.SectionHeader}>Current Quests</h3> : null}
            <div className={styles.SectionQuests}>{currentQuests}</div>
            {availableQuests.length ? <h3 className={styles.SectionHeader}>Available Quests</h3> : null}
            <div className={styles.SectionQuests}>{availableQuests}</div>
         </div>
      </div>
   ) : null;
};
