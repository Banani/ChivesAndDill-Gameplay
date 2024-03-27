import { ActiveNpcConversation, GlobalStoreModule } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import {
    ConversationWithNpcEndedEvent,
    ConversationWithNpcStartedEvent,
    NpcEngineEvents
} from '../Events';

export class ActiveNpcConversationNotifier extends Notifier<ActiveNpcConversation> {
    constructor() {
        super({ key: GlobalStoreModule.NPC_CONVERSATION });
        this.eventsToHandlersMap = {
            [NpcEngineEvents.ConversationWithNpcStarted]: this.handleConversationWithNpcStarted,
            [NpcEngineEvents.ConversationWithNpcEnded]: this.handleConversationWithNpcEnded,
        };
    }

    handleConversationWithNpcStarted: EngineEventHandler<ConversationWithNpcStartedEvent> = ({ event, services }) => {
        const receiverId = this.getReceiverId(event.characterId, services);
        if (!receiverId) {
            return;
        }

        this.multicastMultipleObjectsUpdate([{ receiverId, objects: { [event.characterId]: { npcId: event.npcId } } }]);
    };

    handleConversationWithNpcEnded: EngineEventHandler<ConversationWithNpcEndedEvent> = ({ event, services }) => {
        const receiverId = this.getReceiverId(event.characterId, services);
        if (!receiverId) {
            return;
        }

        this.multicastObjectsDeletion([
            {
                receiverId,
                objects: { [event.characterId]: null },
            },
        ]);
    };
}
