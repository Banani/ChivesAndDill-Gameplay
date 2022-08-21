import { QuestSchema } from '@bananos/types';
import { KeyBoardContext } from 'apps/chives-and-dill/src/contexts/KeyBoardContext';
import { useEnginePackageProvider } from 'apps/chives-and-dill/src/hooks';
import React, { FunctionComponent, useContext, useEffect } from 'react';
import { Button } from '../../../components/button/Button';
import { QuestDescription } from '../../../quests/components';
import styles from './CompleteQuestNpcModal.module.scss';

interface CompleteQuestNpcModalProps {
   questSchema: QuestSchema;
   close: () => void;
   questId: string;
   completeQuest: () => void;
}

export const CompleteQuestNpcModal: FunctionComponent<CompleteQuestNpcModalProps> = ({ close, questSchema, questId, completeQuest }) => {
   const keyBoardContext = useContext(KeyBoardContext);
   const { questProgress } = useEnginePackageProvider();

   useEffect(() => {
      keyBoardContext.addKeyHandler({
         id: 'CompleteQuestNpcModalEscape',
         matchRegex: 'Escape',
         keydown: close,
      });

      keyBoardContext.addKeyHandler({
         id: 'CompleteQuestNpcModalEnter',
         matchRegex: 'Enter',
         keydown: () => {},
      });

      return () => {
         keyBoardContext.removeKeyHandler('CompleteQuestNpcModalEscape');
         keyBoardContext.removeKeyHandler('CompleteQuestNpcModalEnter');
      };
   }, []);

   return (
      <div className={styles.ContentWrapper}>
         <div className={styles.QuestDefinitionHolder}>
            <QuestDescription questSchema={questSchema} />
         </div>
         <div className={styles.ActionBar}>
            <Button onClick={completeQuest} disabled={!questProgress?.[questId].allStagesCompleted}>
               Complete Quest
            </Button>
         </div>
      </div>
   );
};
