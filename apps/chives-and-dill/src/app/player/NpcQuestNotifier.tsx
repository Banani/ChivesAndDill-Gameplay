import { GlobalStoreModule } from '@bananos/types';
import { Sprite } from '@inlet/react-pixi';
import _ from 'lodash';
import React from 'react';
import exclamationMark from '../../assets/spritesheets/questNpc/exclamationMark.png';
import questionMark from '../../assets/spritesheets/questNpc/questionMark.png';
import { useEngineModuleReader } from '../../hooks';

export const NpcQuestNotifier = ({ location, player }) => {
   const { data: npcQuests } = useEngineModuleReader(GlobalStoreModule.NPC_QUESTS);
   const { data: questProgress } = useEngineModuleReader(GlobalStoreModule.QUEST_PROGRESS);

   let questImageMark = exclamationMark;

   if (player.type !== 'Npc') {
      return null;
   }

   const quests = _.cloneDeep(npcQuests?.[player.templateId]);

   _.forEach(quests, (_, questId) => {
      if (questProgress?.[questId]) {
         delete quests[questId];
      }
      if (questProgress?.[questId]?.allStagesCompleted) {
         delete quests[questId];
         questImageMark = questionMark;
      }
   });

   if (Object.keys(quests ?? {}).length === 0) {
      return null;
   }

   return <Sprite image={questImageMark} x={location.x} y={location.y - 95} />;
};
