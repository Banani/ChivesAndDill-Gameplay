import { GlobalStoreModule } from '@bananos/types';
import { Sprite } from '@inlet/react-pixi';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import exclamationMark from '../../assets/spritesheets/questNpc/exclamationMark.png';
import questionMark from '../../assets/spritesheets/questNpc/questionMark.png';
import { useEngineModuleReader } from '../../hooks';

export const NpcQuestNotifier = ({ location, player }) => {
    const { data: npcQuests } = useEngineModuleReader(GlobalStoreModule.NPC_QUESTS);
    const { data: questProgress } = useEngineModuleReader(GlobalStoreModule.QUEST_PROGRESS);

    const [questImageMark, updateQuestImageMark] = useState(exclamationMark);
    const [isVisible, changeIsVisible] = useState(true);

    if (player.type !== 'Npc') {
        return null;
    }

    const quests = _.cloneDeep(npcQuests?.[player.templateId]);

    useEffect(() => {
        _.forEach(quests, (_, questId) => {
            if (questProgress?.[questId]) {
                changeIsVisible(false);
            }

            if (questProgress?.[questId]?.allStagesCompleted) {
                delete quests[questId];
                changeIsVisible(true)
                updateQuestImageMark(questionMark);
            }
        });
    }, [questProgress]);

    if (Object.keys(quests ?? {}).length === 0) {
        return null;
    }

    return isVisible ? <Sprite image={questImageMark} x={location.x} y={location.y - 95} /> : null;
};
