import { GlobalStoreModule } from '@bananos/types';
import { EngineApiContext } from 'apps/chives-and-dill/src/contexts/EngineApi';
import { GameControllerContext } from 'apps/chives-and-dill/src/contexts/GameController';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import type { FunctionComponent } from 'react';
import React, { useCallback, useContext, useState } from 'react';
import { AvailableQuestNpcModal, CompleteQuestNpcModal, DefaultNpcModal, TradeNpcModal } from './components';

export enum NpcModalView {
    Default,
    AvailableQuest,
    CompletedQuest,
    Trade,
}

export const NpcModal: FunctionComponent = () => {
    const { activeCharacterId } = useContext(GameControllerContext);
    const { data: activeConversation } = useEngineModuleReader(GlobalStoreModule.NPC_CONVERSATION);
    const { data: characters } = useEngineModuleReader(GlobalStoreModule.CHARACTER);
    const { data: questProgress } = useEngineModuleReader(GlobalStoreModule.QUEST_PROGRESS);
    const { data: questDefinition } = useEngineModuleReader(GlobalStoreModule.QUEST_DEFINITION);
    const activeNpc = characters[activeConversation[activeCharacterId]?.npcId];

    const [currentModal, setCurrentModal] = useState(NpcModalView.Default);
    const [activeQuestId, setActiveQuestId] = useState(null);
    const context = useContext(EngineApiContext);

    const acceptQuest = useCallback(() => {
        context.takeQuestFromNpc({ npcId: activeNpc.id, questId: activeQuestId });
        setCurrentModal(NpcModalView.Default);
        setActiveQuestId(null);
    }, [activeNpc?.id, activeQuestId, context]);

    const completeQuest = useCallback(() => {
        context.finalizeQuestWithNpc({ npcId: activeNpc.id, questId: activeQuestId });
        setCurrentModal(NpcModalView.Default);
        setActiveQuestId(null);
    }, [activeNpc?.id, activeQuestId, context]);

    const closeNpcModal = () => {
        if (currentModal !== NpcModalView.Default && currentModal !== NpcModalView.Trade) {
            setCurrentModal(NpcModalView.Default);
        } else {
            context.closeNpcConversationDialog();
        }
    };

    if (!activeNpc) {
        return null;
    }

    return (
        <>
            {currentModal === NpcModalView.Default && (
                <DefaultNpcModal
                    openQuest={(questId) => {
                        setCurrentModal(questProgress?.[questId] ? NpcModalView.CompletedQuest : NpcModalView.AvailableQuest);
                        setActiveQuestId(questId);
                    }}
                    setCurrentModal={setCurrentModal}
                    closeNpcModal={closeNpcModal}
                />
            )}
            {currentModal === NpcModalView.AvailableQuest && (
                <AvailableQuestNpcModal
                    close={() => setCurrentModal(NpcModalView.Default)}
                    acceptQuest={acceptQuest}
                    questSchema={questDefinition[activeQuestId]}
                    closeNpcModal={closeNpcModal}
                />
            )}
            {currentModal === NpcModalView.CompletedQuest && (
                <CompleteQuestNpcModal
                    close={() => setCurrentModal(NpcModalView.Default)}
                    questSchema={questDefinition[activeQuestId]}
                    completeQuest={completeQuest}
                    questId={activeQuestId}
                    closeNpcModal={closeNpcModal}
                />
            )}
            {currentModal === NpcModalView.Trade && (
                <TradeNpcModal
                    closeNpcModal={closeNpcModal}
                />
            )}
        </>
    );
}
