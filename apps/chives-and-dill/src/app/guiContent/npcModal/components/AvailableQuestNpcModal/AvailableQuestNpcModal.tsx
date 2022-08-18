import { QuestSchema } from '@bananos/types';
import React, { FunctionComponent } from 'react';
import { QuestDescription } from '../../../quests/components';

interface AvailableQuestNpcModalProps {
   questSchema: QuestSchema;
   acceptQuest: () => void;
}

export const AvailableQuestNpcModal: FunctionComponent<AvailableQuestNpcModalProps> = ({ questSchema, acceptQuest }) => {
   return (
      <div>
         <QuestDescription questSchema={questSchema} />
         <button onClick={acceptQuest}>AKCEPTO-INATOR</button>
      </div>
   );
};
