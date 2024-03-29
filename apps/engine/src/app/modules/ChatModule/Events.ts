import { ChannelType, ChatChannel, Location } from '@bananos/types';
import { EngineEvent, EngineEventHandler } from '../../types';

export enum ChatEngineEvents {
    ChatChannelCreated = 'ChatChannelCreated',

    DeleteChatChannel = 'DeleteChatChannel',
    ChatChannelDeleted = 'ChatChannelDeleted',

    AddPlayerCharacterToChat = 'AddPlayerCharacterToChat',
    CharacterAddedToChat = 'CharacterAddedToChat',

    PlayerCharacterRemovedFromChatChannel = 'PlayerCharacterRemovedFromChatChannel',
    PlayerLeftChatChannel = 'PlayerLeftCharChannel',

    ChangeChatChannelOwner = 'ChangeChatChannelOwner',
    ChatChannelOwnerChanged = 'ChatChannelOwnerChanged',

    SendChatMessage = 'SendChatMessage',
    ChatMessageSent = 'ChatMessageSent',

    ChatMessagesDeleted = 'ChatMessagesDeleted',
}

export interface ChatChannelCreatedEvent extends EngineEvent {
    type: ChatEngineEvents.ChatChannelCreated;
    chatChannel: ChatChannel;
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
    characterId: string;
}

export interface CharacterAddedToChatEvent extends EngineEvent {
    type: ChatEngineEvents.CharacterAddedToChat;
    chatChannel: ChatChannel;
    characterId: string;
}

export interface PlayerCharacterRemovedFromChatChannelEvent extends EngineEvent {
    type: ChatEngineEvents.PlayerCharacterRemovedFromChatChannel;
    chatChannel: ChatChannel;
    characterId: string;
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

interface PrivateMessageDetails {
    channelType: ChannelType.Private,
    authorId: string;
    chatChannelId: string;
    location: Location;
}

interface RangeMessageDetails {
    channelType: ChannelType.Range,
    authorId: string;
    chatChannelId: string;
    location: Location;

}
interface QuoteMessageDetails {
    channelType: ChannelType.Quotes,
    authorId: string;
    location: Location;
}

interface SystemMessageDetails {
    channelType: ChannelType.System,
    targetId: string,
    itemId?: string,
    amount?: number
}

type MessageDetails = PrivateMessageDetails | RangeMessageDetails | QuoteMessageDetails | SystemMessageDetails;

export interface SendChatMessageEvent extends EngineEvent {
    type: ChatEngineEvents.SendChatMessage;
    message: string;
    details: MessageDetails;
}

export interface ChatMessageSentEvent extends EngineEvent {
    type: ChatEngineEvents.ChatMessageSent;
    messageId: string;
    message: string;
    time: number;
    chatMessage: MessageDetails;
}

export interface ChatMessagesDeletedEvent extends EngineEvent {
    type: ChatEngineEvents.ChatMessagesDeleted;
    messagesIds: string[];
    receiversIds: string[];
}

export interface ChatEngineEventsMap {
    [ChatEngineEvents.ChatChannelCreated]: EngineEventHandler<ChatChannelCreatedEvent>;

    [ChatEngineEvents.DeleteChatChannel]: EngineEventHandler<DeleteChatChannelEvent>;
    [ChatEngineEvents.ChatChannelDeleted]: EngineEventHandler<ChatChannelDeletedEvent>;

    [ChatEngineEvents.AddPlayerCharacterToChat]: EngineEventHandler<AddPlayerCharacterToChatEvent>;
    [ChatEngineEvents.CharacterAddedToChat]: EngineEventHandler<CharacterAddedToChatEvent>;

    [ChatEngineEvents.PlayerCharacterRemovedFromChatChannel]: EngineEventHandler<PlayerCharacterRemovedFromChatChannelEvent>;
    [ChatEngineEvents.PlayerLeftChatChannel]: EngineEventHandler<PlayerLeftChatChannelEvent>;

    [ChatEngineEvents.ChangeChatChannelOwner]: EngineEventHandler<ChangeChatChannelOwnerEvent>;
    [ChatEngineEvents.ChatChannelOwnerChanged]: EngineEventHandler<ChatChannelOwnerChangedEvent>;

    [ChatEngineEvents.SendChatMessage]: EngineEventHandler<SendChatMessageEvent>;
    [ChatEngineEvents.ChatMessageSent]: EngineEventHandler<ChatMessageSentEvent>;
    [ChatEngineEvents.ChatMessagesDeleted]: EngineEventHandler<ChatMessagesDeletedEvent>;
}
