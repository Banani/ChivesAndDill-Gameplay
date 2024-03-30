import { CharacterType, ChatChannel, GlobalStoreModule } from '@bananos/types';
import { map, pickBy } from 'lodash';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { PlayerCharacter } from '../../../types/PlayerCharacter';
import {
    CharacterAddedToChatEvent,
    ChatChannelCreatedEvent,
    ChatChannelDeletedEvent,
    ChatChannelOwnerChangedEvent,
    ChatEngineEvents,
    PlayerCharacterRemovedFromChatChannelEvent,
    PlayerLeftChatChannelEvent
} from '../Events';

export class ChatChannelNotifier extends Notifier<ChatChannel> {
    constructor() {
        super({ key: GlobalStoreModule.CHAT_CHANNEL });
        this.eventsToHandlersMap = {
            [ChatEngineEvents.ChatChannelCreated]: this.handleChatChannelCreated,
            [ChatEngineEvents.ChatChannelDeleted]: this.handleChatChannelDeleted,
            [ChatEngineEvents.CharacterAddedToChat]: this.handleCharacterAddedToChat,
            [ChatEngineEvents.PlayerCharacterRemovedFromChatChannel]: this.handlePlayerCharacterRemovedFromChatChannel,
            [ChatEngineEvents.PlayerLeftChatChannel]: this.handlePlayerLeftChatChannel,
            [ChatEngineEvents.ChatChannelOwnerChanged]: this.handleChangeChatChannelOwner,
        };
    }

    handleChatChannelCreated: EngineEventHandler<ChatChannelCreatedEvent> = ({ event, services }) => {
        const receiverId = this.getReceiverId(event.chatChannel.characterOwnerId, services);
        if (!receiverId) {
            return;
        }

        this.multicastMultipleObjectsUpdate([{ receiverId, objects: { [event.chatChannel.id]: event.chatChannel } }]);
    };

    handleChatChannelDeleted: EngineEventHandler<ChatChannelDeletedEvent> = ({ event, services }) => {
        const characters = pickBy(services.characterService.getAllCharacters(), (character) => character.type === CharacterType.Player) as Record<
            string,
            PlayerCharacter
        >;

        this.multicastObjectsDeletion(
            map(event.chatChannel.membersIds, (_, memberId) => ({
                receiverId: characters[memberId].ownerId,
                objects: { [event.chatChannelId]: null },
            }))
        );

        this.multicastObjectsDeletion(
            map(event.chatChannel.membersIds, (_, memberId) => ({
                receiverId: characters[memberId].ownerId,
                objects: { [event.chatChannel.id]: { membersIds: { [memberId]: null } } },
            }))
        );
    };

    handleCharacterAddedToChat: EngineEventHandler<CharacterAddedToChatEvent> = ({ event, services }) => {
        const characters = pickBy(services.characterService.getAllCharacters(), (character) => character.type === CharacterType.Player) as Record<
            string,
            PlayerCharacter
        >;

        this.multicastMultipleObjectsUpdate(
            map(event.chatChannel.membersIds, (_, memberId) => ({
                receiverId: characters[memberId].ownerId,
                objects: { [event.chatChannel.id]: { membersIds: { [event.characterId]: true } } },
            }))
        );

        this.multicastMultipleObjectsUpdate([{ receiverId: characters[event.characterId].ownerId, objects: { [event.chatChannel.id]: event.chatChannel } }]);
    };

    handlePlayerCharacterRemovedFromChatChannel: EngineEventHandler<PlayerCharacterRemovedFromChatChannelEvent> = ({ event, services }) => {
        const characters = pickBy(services.characterService.getAllCharacters(), (character) => character.type === CharacterType.Player) as Record<
            string,
            PlayerCharacter
        >;

        this.multicastObjectsDeletion(
            map(event.chatChannel.membersIds, (_, memberId) => ({
                receiverId: characters[memberId].ownerId,
                objects: { [event.chatChannel.id]: { membersIds: { [event.characterId]: null } } },
            }))
        );

        this.multicastObjectsDeletion([
            { receiverId: characters[event.characterId].ownerId, objects: { [event.chatChannel.id]: { membersIds: { [event.characterId]: null } } } },
        ]);
    };

    handlePlayerLeftChatChannel: EngineEventHandler<PlayerLeftChatChannelEvent> = ({ event, services }) => {
        const characters = pickBy(services.characterService.getAllCharacters(), (character) => character.type === CharacterType.Player) as Record<
            string,
            PlayerCharacter
        >;

        this.multicastObjectsDeletion(
            map(event.chatChannel.membersIds, (_, memberId) => ({
                receiverId: characters[memberId].ownerId,
                objects: { [event.chatChannel.id]: { membersIds: { [event.characterId]: null } } },
            }))
        );

        this.multicastObjectsDeletion([
            { receiverId: characters[event.characterId].ownerId, objects: { [event.chatChannel.id]: { membersIds: { [event.characterId]: null } } } },
        ]);
    };

    handleChangeChatChannelOwner: EngineEventHandler<ChatChannelOwnerChangedEvent> = ({ event, services }) => {
        const characters = pickBy(services.characterService.getAllCharacters(), (character) => character.type === CharacterType.Player) as Record<
            string,
            PlayerCharacter
        >;

        this.multicastMultipleObjectsUpdate(
            map(event.chatChannel.membersIds, (_, memberId) => ({
                receiverId: characters[memberId].ownerId,
                objects: { [event.chatChannel.id]: { characterOwnerId: event.newOwnerId } },
            }))
        );
    };
}
