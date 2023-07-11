import { ChannelType, QuoteChatMessage } from '@bananos/types';
import { now } from 'lodash';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import { ChatEngineEvents, ChatMessageSentEvent, SendChatMessageEvent } from '../Events';

export class ChatQuoteMessageService extends EventParser {
    private messages: Record<string, QuoteChatMessage> = {};
    private increment = 0;

    constructor() {
        super();
        this.eventsToHandlersMap = {
            [ChatEngineEvents.SendChatMessage]: this.handleSendChatMessage,
        };
    }

    handleSendChatMessage: EngineEventHandler<SendChatMessageEvent> = ({ event, services }) => {
        if (event.channelType !== ChannelType.Quotes) {
            return;
        }

        const id = `chatQuoteMessage_${this.increment++}`;
        this.messages[id] = {
            id,
            message: event.message,
            authorId: event.characterId,
            time: now(),
            channelType: ChannelType.Quotes,
        };

        this.engineEventCrator.asyncCeateEvent<ChatMessageSentEvent>({
            type: ChatEngineEvents.ChatMessageSent,
            chatMessage: this.messages[id],
        });
    };
}
