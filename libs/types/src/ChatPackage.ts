import { Location } from "./shared";

export interface ChatChannel {
    id?: string;
    name: string;
    characterOwnerId: string | null;
    membersIds: Record<string, boolean>;
}

export interface CommonChatMessage {
    id: string;
    time: number;
    message: string;
    channelType: ChannelType;
}

export interface SystemChatMessage extends CommonChatMessage {
    channelType: ChannelType.System,
    targetId: string,
    itemId?: string,
    amount?: number
}

export interface QuoteChatMessage extends CommonChatMessage {
    channelType: ChannelType.Quotes;
    authorId: string;
    location: Location;
}

export interface RangeChatMessage extends CommonChatMessage {
    channelType: ChannelType.Range;
    authorId: string;
    chatChannelId: string;
    location: Location;
}

export interface ChannelChatMessage extends CommonChatMessage {
    channelType: ChannelType.Custom;
    authorId: string;
    chatChannelId: string;
    location: Location;
}

export type ChatMessage = ChannelChatMessage | RangeChatMessage | QuoteChatMessage | SystemChatMessage;

export enum ChannelType {
    Custom = 'Custom',
    Range = 'Range',
    Quotes = 'Quotes',
    System = "System"
}

export enum ChatChannelClientMessages {
    CreateChatChannel = 'CreateChatChannel',
    DeleteChatChannel = 'DeleteChatChannel',
    InvitePlayerCharacterToChatChannel = 'InvitePlayerCharacterToChatChannel',
    RemovePlayerCharacterFromChatChannel = 'RemovePlayerCharacterFromChatChannel',
    LeaveChatChannel = 'LeaveChatChannel',
    ChangeChatChannelOwner = 'ChangeChatChannelOwner',
    SendChatMessage = 'SendChatMessage',
}

export interface CreateChatChannel {
    type: ChatChannelClientMessages.CreateChatChannel;
    chatChannelName: string;
}

export interface DeleteChatChannel {
    type: ChatChannelClientMessages.DeleteChatChannel;
    chatChannelId: string;
}

export interface InvitePlayerCharacterToChatChannel {
    type: ChatChannelClientMessages.InvitePlayerCharacterToChatChannel;
    chatChannelId: string;
    characterName: string;
}

export interface RemovePlayerCharacterFromChatChannel {
    type: ChatChannelClientMessages.RemovePlayerCharacterFromChatChannel;
    chatChannelId: string;
    characterId: string;
}

export interface LeaveChatChannel {
    type: ChatChannelClientMessages.LeaveChatChannel;
    chatChannelId: string;
}

export interface ChangeChatChannelOwner {
    type: ChatChannelClientMessages.ChangeChatChannelOwner;
    chatChannelId: string;
    newOwnerId: string;
}

export interface SendChatMessage {
    type: ChatChannelClientMessages.SendChatMessage;
    chatChannelId: string;
    message: string;
    channelType: ChannelType;
}

export type EngineChatAction =
    | CreateChatChannel
    | DeleteChatChannel
    | InvitePlayerCharacterToChatChannel
    | RemovePlayerCharacterFromChatChannel
    | LeaveChatChannel
    | ChangeChatChannelOwner
    | SendChatMessage;
