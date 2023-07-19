import { ChannelType } from '@bananos/types';
import { now } from 'lodash';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import { ChatEngineEvents, ChatMessageSentEvent, SendChatMessageEvent } from '../Events';

export class ChatQuoteMessageService extends EventParser {
    private increment = 0;

    constructor() {
        super();
        this.eventsToHandlersMap = {
            [ChatEngineEvents.SendChatMessage]: this.handleSendChatMessage,
        };
    }

    handleSendChatMessage: EngineEventHandler<SendChatMessageEvent> = ({ event, services }) => {
        if (event.details.channelType !== ChannelType.Quotes) {
            return;
        }

        const messageId = `chatQuoteMessage_${this.increment++}`;

        this.engineEventCrator.asyncCeateEvent<ChatMessageSentEvent>({
            type: ChatEngineEvents.ChatMessageSent,
            messageId,
            message: event.message,
            time: now(),
            chatMessage: event.details
        });
    };
}
