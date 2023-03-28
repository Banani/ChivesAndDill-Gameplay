import type { QuestSchema } from '@bananos/types';
import { GlobalStoreModule } from '@bananos/types';
import { KeyBoardContext } from 'apps/chives-and-dill/src/contexts/KeyBoardContext';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import type { FunctionComponent } from 'react';
import React, { useContext, useEffect } from 'react';
import { Button } from '../../../components/button/Button';
import { QuestDescription } from '../../../quests/components';
import styles from './CompleteQuestNpcModal.module.scss';
import { ModalHeader } from '../ModalHeader/ModalHeader';

interface CompleteQuestNpcModalProps {
   questSchema: QuestSchema;
   close: () => void;
   questId: string;
   completeQuest: () => void;
   closeNpcModal: any;
}

export const CompleteQuestNpcModal: FunctionComponent<CompleteQuestNpcModalProps> = ({ close, questSchema, questId, completeQuest, closeNpcModal }) => {
   const keyBoardContext = useContext(KeyBoardContext);
   const { data: questProgress } = useEngineModuleReader(GlobalStoreModule.QUEST_PROGRESS);
   const { activeCharacterId } = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER).data;
   const { data: activeConversation } = useEngineModuleReader(GlobalStoreModule.NPC_CONVERSATION);
   const { data: characters } = useEngineModuleReader(GlobalStoreModule.CHARACTER);
   const activeNpc = characters[activeConversation[activeCharacterId]?.npcId];
   
   useEffect(() => {
      keyBoardContext.addKeyHandler({
         id: 'CompleteQuestNpcModalEscape',
         matchRegex: 'Escape',
         keydown: close,
      });

      keyBoardContext.addKeyHandler({
         id: 'CompleteQuestNpcModalEnter',
         matchRegex: 'Enter',
         keydown: () => { },
      });

      return () => {
         keyBoardContext.removeKeyHandler('CompleteQuestNpcModalEscape');
         keyBoardContext.removeKeyHandler('CompleteQuestNpcModalEnter');
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
               <Button onClick={completeQuest} disabled={!questProgress?.[questId]?.allStagesCompleted}>
                  Complete Quest
               </Button>
            </div>
         </div>
      </div>
      
   );
};
