import { ChannelType } from '@bananos/types';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import { ChatEngineEvents, SendChatMessageEvent } from '../../ChatModule/Events';
import { QuestCompletedEvent, QuestEngineEvents, QuestStartedEvent } from '../Events';

export class QuestMessagesService extends EventParser {
    constructor() {
        super();
        this.eventsToHandlersMap = {
            [QuestEngineEvents.QuestStarted]: this.handleQuestStarted,
            [QuestEngineEvents.QuestCompleted]: this.handleQuestCompleted,
        };
    }

    handleQuestStarted: EngineEventHandler<QuestStartedEvent> = ({ event, services }) => {
        const quest = services.questSchemasService.getData()[event.questTemplate.id];

        this.engineEventCrator.asyncCeateEvent<SendChatMessageEvent>({
            type: ChatEngineEvents.SendChatMessage,
            message: `Quest accepted: ${quest.name}`,
            details: {
                channelType: ChannelType.System,
                targetId: event.characterId
            }
        });
    };

    handleQuestCompleted: EngineEventHandler<QuestCompletedEvent> = ({ event, services }) => {
        const quest = services.questSchemasService.getData()[event.questId];

        this.engineEventCrator.asyncCeateEvent<SendChatMessageEvent>({
            type: ChatEngineEvents.SendChatMessage,
            message: `${quest.name} completed.`,
            details: {
                channelType: ChannelType.System,
                targetId: event.characterId,
            }
        });

        this.engineEventCrator.asyncCeateEvent<SendChatMessageEvent>({
            type: ChatEngineEvents.SendChatMessage,
            message: `Experience gained ${quest.questReward.experience}.`,
            details: {
                channelType: ChannelType.System,
                targetId: event.characterId
            }
        });
    };
}
