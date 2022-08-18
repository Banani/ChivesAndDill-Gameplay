import {
   AllExternalQuestStageProgress,
   AllQuestStagePart,
   ExternalKillingQuestStageProgress,
   KillingQuestStagePart,
   MovementQuestStagePart,
   QuestType,
} from '@bananos/types';
import React, { FunctionComponent } from 'react';

const questStagePartTransformers: Record<QuestType, (questStagePart: AllQuestStagePart) => JSX.Element> = {
   [QuestType.MOVEMENT]: (questStagePart: MovementQuestStagePart) => <>Go to {questStagePart.locationName}</>,
   [QuestType.KILLING]: (questStagePart: KillingQuestStagePart) => <>Not supported yet</>,
};

const questStagePartProgressTransformers: Record<
   QuestType,
   (questStagePart: AllQuestStagePart, stagePartProgress: AllExternalQuestStageProgress) => JSX.Element
> = {
   [QuestType.MOVEMENT]: (questStagePart: MovementQuestStagePart) => <>Go to {questStagePart.locationName}</>,
   [QuestType.KILLING]: (questStagePart: KillingQuestStagePart, stagePartProgress: ExternalKillingQuestStageProgress) => (
      <>
         You killed {stagePartProgress.currentAmount} out of {questStagePart.amount}
      </>
   ),
};

interface QuestStagePartProps {
   questStagePart: AllQuestStagePart;
   stagePartProgress?: AllExternalQuestStageProgress;
}

export const QuestStagePart: FunctionComponent<QuestStagePartProps> = ({ questStagePart, stagePartProgress }) => {
   if (stagePartProgress) {
      return questStagePartProgressTransformers[questStagePart.type](questStagePart, stagePartProgress);
   }

   return questStagePartTransformers[questStagePart.type](questStagePart);
};
