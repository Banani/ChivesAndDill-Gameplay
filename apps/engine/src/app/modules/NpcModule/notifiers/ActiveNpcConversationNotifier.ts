import { ActiveNpcConversation, GlobalStoreModule, NpcClientMessages } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import { CharacterType, EngineEventHandler } from '../../../types';
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

        currentSocket.on(NpcClientMessages.OpenNpcConversationDialog, ({ npcId }) => {
            this.engineEventCrator.asyncCeateEvent<PlayerTriesToStartConversationEvent>({
                type: NpcEngineEvents.PlayerTriesToStartConversation,
                requestingCharacterId: event.playerCharacter.id,
                npcId,
            });
        });

        currentSocket.on(NpcClientMessages.CloseNpcConversationDialog, () => {
            this.engineEventCrator.asyncCeateEvent<PlayerTriesToFinishConversationEvent>({
                type: NpcEngineEvents.PlayerTriesToFinishConversation,
                requestingCharacterId: event.playerCharacter.id,
            });
        });
    };

    handleConversationWithNpcStarted: EngineEventHandler<ConversationWithNpcStartedEvent> = ({ event, services }) => {
        const character = services.characterService.getCharacterById(event.characterId);
        if (character.type != CharacterType.Player) {
            return;
        }

        this.multicastMultipleObjectsUpdate([{ receiverId: character.ownerId, objects: { [character.id]: { npcId: event.npcId } } }]);
    };

    handleConversationWithNpcEnded: EngineEventHandler<ConversationWithNpcEndedEvent> = ({ event, services }) => {
        const character = services.characterService.getCharacterById(event.characterId);
        if (character.type != CharacterType.Player) {
            return;
        }

        this.multicastObjectsDeletion([
            {
                receiverId: character.ownerId,
                objects: { [event.characterId]: null },
            },
        ]);
    };
}
