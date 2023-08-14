import { CharacterType, ChatChannel, ChatChannelClientActions, GlobalStoreModule } from '@bananos/types';
import { map, pickBy } from 'lodash';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { PlayerCharacter } from '../../../types/PlayerCharacter';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import {
    AddPlayerCharacterToChatEvent,
    ChangeChatChannelOwnerEvent,
    CharacterAddedToChatEvent,
    ChatChannelCreatedEvent,
    ChatChannelDeletedEvent,
    ChatChannelOwnerChangedEvent,
    ChatEngineEvents,
    CreateChatChannelEvent,
    DeleteChatChannelEvent,
    LeaveChatChannelEvent,
    PlayerCharacterRemovedFromChatChannelEvent,
    PlayerLeftChatChannelEvent,
    RemovePlayerCharacterFromChatChannelEvent,
} from '../Events';

export class ChatChannelNotifier extends Notifier<ChatChannel> {
    constructor() {
        super({ key: GlobalStoreModule.CHAT_CHANNEL });
        this.eventsToHandlersMap = {
            [ChatEngineEvents.ChatChannelCreated]: this.handleChatChannelCreated,
            [ChatEngineEvents.ChatChannelDeleted]: this.handleChatChannelDeleted,
            [PlayerEngineEvents.PlayerCharacterCreated]: this.handlePlayerCharacterCreated,
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

        this.multicastMultipleObjectsUpdate([{ receiverId, objects: { [event.channelId]: event.chatChannel } }]);
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

    handlePlayerCharacterCreated: EngineEventHandler<PlayerCharacterCreatedEvent> = ({ event, services }) => {
        const currentSocket = services.socketConnectionService.getSocketById(event.playerCharacter.ownerId);

        currentSocket.on(ChatChannelClientActions.CreateChatChannel, ({ chatChannelName }) => {
            this.engineEventCrator.asyncCeateEvent<CreateChatChannelEvent>({
                type: ChatEngineEvents.CreateChatChannel,
                requestingCharacterId: event.playerCharacter.id,
                chatChannel: {
                    name: chatChannelName,
                    characterOwnerId: event.playerCharacter.id,
                    membersIds: {},
                },
            });
        });

        currentSocket.on(ChatChannelClientActions.DeleteChatChannel, ({ chatChannelId }) => {
            const chatChannel = services.chatChannelService.getChatChannelById(chatChannelId);

            this.engineEventCrator.asyncCeateEvent<DeleteChatChannelEvent>({
                type: ChatEngineEvents.DeleteChatChannel,
                requestingCharacterId: event.playerCharacter.id,
                chatChannel,
            });
        });

        currentSocket.on(ChatChannelClientActions.InvitePlayerCharacterToChatChannel, ({ chatChannelId, characterName }) => {
            this.engineEventCrator.asyncCeateEvent<AddPlayerCharacterToChatEvent>({
                type: ChatEngineEvents.AddPlayerCharacterToChat,
                requestingCharacterId: event.playerCharacter.id,
                characterName,
                chatChannelId,
            });
        });

        currentSocket.on(ChatChannelClientActions.RemovePlayerCharacterFromChatChannel, ({ chatChannelId, characterId }) => {
            this.engineEventCrator.asyncCeateEvent<RemovePlayerCharacterFromChatChannelEvent>({
                type: ChatEngineEvents.RemovePlayerCharacterFromChatChannel,
                requestingCharacterId: event.playerCharacter.id,
                characterId,
                chatChannelId,
            });
        });

        currentSocket.on(ChatChannelClientActions.LeaveChatChannel, ({ chatChannelId }) => {
            this.engineEventCrator.asyncCeateEvent<LeaveChatChannelEvent>({
                type: ChatEngineEvents.LeaveChatChannel,
                requestingCharacterId: event.playerCharacter.id,
                chatChannelId,
            });
        });

        currentSocket.on(ChatChannelClientActions.ChangeChatChannelOwner, ({ chatChannelId, newOwnerId }) => {
            this.engineEventCrator.asyncCeateEvent<ChangeChatChannelOwnerEvent>({
                type: ChatEngineEvents.ChangeChatChannelOwner,
                requestingCharacterId: event.playerCharacter.id,
                chatChannelId,
                newOwnerId,
            });
        });
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
