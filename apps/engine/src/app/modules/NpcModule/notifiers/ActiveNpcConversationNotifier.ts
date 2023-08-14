import { ActiveNpcConversation, GlobalStoreModule, NpcClientActions } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import {
    ConversationWithNpcEndedEvent,
    ConversationWithNpcStartedEvent,
    NpcEngineEvents,
    PlayerTriesToFinishConversationEvent,
    PlayerTriesToStartConversationEvent,
} from '../Events';

export class ActiveNpcConversationNotifier extends Notifier<ActiveNpcConversation> {
    constructor() {
        super({ key: GlobalStoreModule.NPC_CONVERSATION });
        this.eventsToHandlersMap = {
            [PlayerEngineEvents.PlayerCharacterCreated]: this.handlePlayerCharacterCreated,
            [NpcEngineEvents.ConversationWithNpcStarted]: this.handleConversationWithNpcStarted,
            [NpcEngineEvents.ConversationWithNpcEnded]: this.handleConversationWithNpcEnded,
        };
    }

    handlePlayerCharacterCreated: EngineEventHandler<PlayerCharacterCreatedEvent> = ({ event, services }) => {
        const currentSocket = services.socketConnectionService.getSocketById(event.playerCharacter.ownerId);

        currentSocket.on(NpcClientActions.OpenNpcConversationDialog, ({ npcId }) => {
            this.engineEventCrator.asyncCeateEvent<PlayerTriesToStartConversationEvent>({
                type: NpcEngineEvents.PlayerTriesToStartConversation,
                requestingCharacterId: event.playerCharacter.id,
                npcId,
            });
        });

        currentSocket.on(NpcClientActions.CloseNpcConversationDialog, () => {
            this.engineEventCrator.asyncCeateEvent<PlayerTriesToFinishConversationEvent>({
                type: NpcEngineEvents.PlayerTriesToFinishConversation,
                requestingCharacterId: event.playerCharacter.id,
            });
        });
    };

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
