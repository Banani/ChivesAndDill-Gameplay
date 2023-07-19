import { ChannelType } from '@bananos/types';
import { now } from 'lodash';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import { ChatEngineEvents, ChatMessageSentEvent, SendChatMessageEvent } from '../Events';
import { RangeChannels } from '../RangeChannels';

export class ChatRangeMessageService extends EventParser {
    private increment = 0;

    constructor() {
        super();
        this.eventsToHandlersMap = {
            [ChatEngineEvents.SendChatMessage]: this.handleSendChatMessage,
        };
    }

    handleSendChatMessage: EngineEventHandler<SendChatMessageEvent> = ({ event, services }) => {
        if (event.details.channelType !== ChannelType.Range) {
            return;
        }

        if (!RangeChannels[event.details.chatChannelId]) {
            this.sendErrorMessage(event.requestingCharacterId, 'Chat channel type does not exist.');
            return;
        }

        const messageId = `chatRangeMessage_${this.increment++}`;

        this.engineEventCrator.asyncCeateEvent<ChatMessageSentEvent>({
            type: ChatEngineEvents.ChatMessageSent,
            messageId,
            message: event.message,
            time: now(),
            chatMessage: event.details
        });
    };
}
