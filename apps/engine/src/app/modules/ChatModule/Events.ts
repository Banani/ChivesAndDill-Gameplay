import { ChannelType, ChatChannel, ChatMessage, Location } from '@bananos/types';
import { EngineEvent, EngineEventHandler } from '../../types';

export enum ChatEngineEvents {
    CreateChatChannel = 'CreateChatChannel',
    ChatChannelCreated = 'ChatChannelCreated',

    DeleteChatChannel = 'DeleteChatChannel',
    ChatChannelDeleted = 'ChatChannelDeleted',

    AddPlayerCharacterToChat = 'AddPlayerCharacterToChat',
    CharacterAddedToChat = 'CharacterAddedToChat',

    RemovePlayerCharacterFromChatChannel = 'RemovePlayerCharacterFromChatChannel',
    PlayerCharacterRemovedFromChatChannel = 'PlayerCharacterRemovedFromChatChannel',
    LeaveChatChannel = 'LeaveChatChannel',
    PlayerLeftChatChannel = 'PlayerLeftCharChannel',

    ChangeChatChannelOwner = 'ChangeChatChannelOwner',
    ChatChannelOwnerChanged = 'ChatChannelOwnerChanged',

    SendChatMessage = 'SendChatMessage',
    ChatMessageSent = 'ChatMessageSent',

    ChatMessagesDeleted = 'ChatMessagesDeleted',
}

export interface CreateChatChannelEvent extends EngineEvent {
    type: ChatEngineEvents.CreateChatChannel;
    chatChannel: ChatChannel;
}

export interface ChatChannelCreatedEvent extends EngineEvent {
    type: ChatEngineEvents.ChatChannelCreated;
    chatChannel: ChatChannel;
    channelId: string;
}

export interface DeleteChatChannelEvent extends EngineEvent {
    type: ChatEngineEvents.DeleteChatChannel;
    chatChannel: ChatChannel;
}

export interface ChatChannelDeletedEvent extends EngineEvent {
    type: ChatEngineEvents.ChatChannelDeleted;
    chatChannel: ChatChannel;
    chatChannelId: string;
}

export interface AddPlayerCharacterToChatEvent extends EngineEvent {
    type: ChatEngineEvents.AddPlayerCharacterToChat;
    chatChannelId: string;
    characterName: string;
}

export interface CharacterAddedToChatEvent extends EngineEvent {
    type: ChatEngineEvents.CharacterAddedToChat;
    chatChannel: ChatChannel;
    characterId: string;
}

export interface RemovePlayerCharacterFromChatChannelEvent extends EngineEvent {
    type: ChatEngineEvents.RemovePlayerCharacterFromChatChannel;
    chatChannelId: string;
    characterId: string;
}

export interface PlayerCharacterRemovedFromChatChannelEvent extends EngineEvent {
    type: ChatEngineEvents.PlayerCharacterRemovedFromChatChannel;
    chatChannel: ChatChannel;
    characterId: string;
}

export interface LeaveChatChannelEvent extends EngineEvent {
    type: ChatEngineEvents.LeaveChatChannel;
    chatChannelId: string;
}

export interface PlayerLeftChatChannelEvent extends EngineEvent {
    type: ChatEngineEvents.PlayerLeftChatChannel;
    characterId: string;
    chatChannel: ChatChannel;
}

export interface ChangeChatChannelOwnerEvent extends EngineEvent {
    type: ChatEngineEvents.ChangeChatChannelOwner;
    chatChannelId: string;
    newOwnerId: string;
}

export interface ChatChannelOwnerChangedEvent extends EngineEvent {
    type: ChatEngineEvents.ChatChannelOwnerChanged;
    chatChannel: ChatChannel;
    newOwnerId: string;
}

// TODO: to powinien byc message object, i jeden wymaga characterId, a drugi chatChannelId, zaleznie od channelType
export interface SendChatMessageEvent extends EngineEvent {
    type: ChatEngineEvents.SendChatMessage;
    characterId?: string;
    chatChannelId?: string;
    message: string;
    channelType: ChannelType;
    location: Location;
}

export interface ChatMessageSentEvent extends EngineEvent {
    type: ChatEngineEvents.ChatMessageSent;
    chatMessage: ChatMessage;
}

export interface ChatMessagesDeletedEvent extends EngineEvent {
    type: ChatEngineEvents.ChatMessagesDeleted;
    messagesIds: string[];
    receiversIds: string[];
}

export interface ChatEngineEventsMap {
    [ChatEngineEvents.CreateChatChannel]: EngineEventHandler<CreateChatChannelEvent>;
    [ChatEngineEvents.ChatChannelCreated]: EngineEventHandler<ChatChannelCreatedEvent>;

    [ChatEngineEvents.DeleteChatChannel]: EngineEventHandler<DeleteChatChannelEvent>;
    [ChatEngineEvents.ChatChannelDeleted]: EngineEventHandler<ChatChannelDeletedEvent>;

    [ChatEngineEvents.AddPlayerCharacterToChat]: EngineEventHandler<AddPlayerCharacterToChatEvent>;
    [ChatEngineEvents.CharacterAddedToChat]: EngineEventHandler<CharacterAddedToChatEvent>;

    [ChatEngineEvents.RemovePlayerCharacterFromChatChannel]: EngineEventHandler<RemovePlayerCharacterFromChatChannelEvent>;
    [ChatEngineEvents.PlayerCharacterRemovedFromChatChannel]: EngineEventHandler<PlayerCharacterRemovedFromChatChannelEvent>;
    [ChatEngineEvents.LeaveChatChannel]: EngineEventHandler<LeaveChatChannelEvent>;
    [ChatEngineEvents.PlayerLeftChatChannel]: EngineEventHandler<PlayerLeftChatChannelEvent>;

    [ChatEngineEvents.ChangeChatChannelOwner]: EngineEventHandler<ChangeChatChannelOwnerEvent>;
    [ChatEngineEvents.ChatChannelOwnerChanged]: EngineEventHandler<ChatChannelOwnerChangedEvent>;

    [ChatEngineEvents.SendChatMessage]: EngineEventHandler<SendChatMessageEvent>;
    [ChatEngineEvents.ChatMessageSent]: EngineEventHandler<ChatMessageSentEvent>;
    [ChatEngineEvents.ChatMessagesDeleted]: EngineEventHandler<ChatMessagesDeletedEvent>;
}
