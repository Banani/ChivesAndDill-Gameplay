import { ChannelType, RangeChatMessage } from '@bananos/types';
import { now } from 'lodash';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import { ChatEngineEvents, ChatMessageSentEvent, SendChatMessageEvent } from '../Events';
import { RangeChannels } from '../RangeChannels';

export class ChatRangeMessageService extends EventParser {
    private messages: Record<string, RangeChatMessage> = {};
    private increment = 0;

    constructor() {
        super();
        this.eventsToHandlersMap = {
            [ChatEngineEvents.SendChatMessage]: this.handleSendChatMessage,
        };
    }

    handleSendChatMessage: EngineEventHandler<SendChatMessageEvent> = ({ event, services }) => {
        if (event.channelType !== ChannelType.Range) {
            return;
        }

        if (!RangeChannels[event.chatChannelId]) {
            this.sendErrorMessage(event.requestingCharacterId, 'Chat channel type does not exist.');
            return;
        }

        const id = `chatRangeMessage_${this.increment++}`;
        this.messages[id] = {
            id,
            message: event.message,
            authorId: event.requestingCharacterId,
            time: now(),
            chatChannelId: event.chatChannelId,
            channelType: ChannelType.Range,
            location: event.location
        };

        this.engineEventCrator.asyncCeateEvent<ChatMessageSentEvent>({
            type: ChatEngineEvents.ChatMessageSent,
            chatMessage: this.messages[id],
        });
    };
}
