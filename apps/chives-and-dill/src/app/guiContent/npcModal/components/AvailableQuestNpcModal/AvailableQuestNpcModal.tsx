import { QuestSchema } from '@bananos/types';
import { KeyBoardContext } from 'apps/chives-and-dill/src/contexts/KeyBoardContext';
import React, { FunctionComponent, useContext, useEffect } from 'react';
import { QuestDescription } from '../../../quests/components';
import { Button } from './../../../components/button/Button';
import styles from './AvailableQuestNpcModal.module.scss';

interface AvailableQuestNpcModalProps {
   questSchema: QuestSchema;
   acceptQuest: () => void;
   close: () => void;
}

export const AvailableQuestNpcModal: FunctionComponent<AvailableQuestNpcModalProps> = ({ questSchema, acceptQuest, close }) => {
   const keyBoardContext = useContext(KeyBoardContext);

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
      <div className={styles.ContentWrapper}>
         <div className={styles.QuestDefinitionHolder}>
            <QuestDescription questSchema={questSchema} />
         </div>
         <div className={styles.ActionBar}>
            <Button onClick={acceptQuest}>Accept</Button>
         </div>
      </div>
   );
};
