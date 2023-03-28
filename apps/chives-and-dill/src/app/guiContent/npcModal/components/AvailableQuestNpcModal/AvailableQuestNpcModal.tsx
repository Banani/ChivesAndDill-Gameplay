import type { QuestSchema } from '@bananos/types';
import { GlobalStoreModule } from '@bananos/types';
import { KeyBoardContext } from 'apps/chives-and-dill/src/contexts/KeyBoardContext';
import type { FunctionComponent } from 'react';
import React, { useContext, useEffect } from 'react';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import { QuestDescription } from '../../../quests/components';
import { Button } from './../../../components/button/Button';
import styles from './AvailableQuestNpcModal.module.scss';
import { ModalHeader } from '../ModalHeader/ModalHeader';

interface AvailableQuestNpcModalProps {
   questSchema: QuestSchema;
   acceptQuest: () => void;
   close: () => void;
   closeNpcModal: any;
}

export const AvailableQuestNpcModal: FunctionComponent<AvailableQuestNpcModalProps> = ({ questSchema, acceptQuest, close, closeNpcModal }) => {
   const keyBoardContext = useContext(KeyBoardContext);
   const { activeCharacterId } = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER).data;
   const { data: activeConversation } = useEngineModuleReader(GlobalStoreModule.NPC_CONVERSATION);
   const { data: characters } = useEngineModuleReader(GlobalStoreModule.CHARACTER);
   const activeNpc = characters[activeConversation[activeCharacterId]?.npcId];

   useEffect(() => {
      keyBoardContext.addKeyHandler({
         id: 'AvailableQuestNpcModalEscape',
         matchRegex: 'Escape',
         keydown: close,
      });

      keyBoardContext.addKeyHandler({
         id: 'AvailableQuestNpcModalEnter',
         matchRegex: 'Enter',
         keydown: acceptQuest,
      });

      return () => {
         keyBoardContext.removeKeyHandler('AvailableQuestNpcModalEscape');
         keyBoardContext.removeKeyHandler('AvailableQuestNpcModalEnter');
      };
   }, []);

   return (
      <div className={styles.NpcModal}>
         <ModalHeader activeNpc={activeNpc} closeNpcModal={closeNpcModal} />
         <div className={styles.ContentWrapper}>
            <div className={styles.QuestDefinitionHolder}>
               <QuestDescription questSchema={questSchema} />
            </div>
            <div className={styles.ActionBar}>
               <Button onClick={acceptQuest}>Accept</Button>
            </div>
         </div>
      </div>

   );
};
