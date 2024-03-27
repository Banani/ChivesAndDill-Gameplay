import { Location } from "../shared";

export interface ChatChannel {
    id: string;
    name: string;
    characterOwnerId: string | null;
    membersIds: Record<string, boolean>;
}

export enum ChannelType {
    Custom = 'Custom',
    Range = 'Range',
    Quotes = 'Quotes',
    System = "System"
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

export enum ChatChannelClientActions {
    CreateChatChannel = 'Player_CreateChatChannel',
    DeleteChatChannel = 'Player_DeleteChatChannel',
    AddPlayerCharacterToChatChannel = 'Player_InvitePlayerCharacterToChatChannel',
    RemovePlayerCharacterFromChatChannel = 'Player_RemovePlayerCharacterFromChatChannel',
    LeaveChatChannel = 'Player_LeaveChatChannel',
    ChangeChatChannelOwner = 'Player_ChangeChatChannelOwner',

    SendChatMessage = 'Player_SendChatMessage',
}

export interface CreateChatChannel {
    type: ChatChannelClientActions.CreateChatChannel;
    chatChannelName: string;
}

export interface DeleteChatChannel {
    type: ChatChannelClientActions.DeleteChatChannel;
    chatChannelId: string;
}

export interface AddPlayerCharacterToChatChannel {
    type: ChatChannelClientActions.AddPlayerCharacterToChatChannel;
    chatChannelId: string;
    characterName: string;
}

export interface RemovePlayerCharacterFromChatChannel {
    type: ChatChannelClientActions.RemovePlayerCharacterFromChatChannel;
    chatChannelId: string;
    characterId: string;
}

export interface LeaveChatChannel {
    type: ChatChannelClientActions.LeaveChatChannel;
    chatChannelId: string;
}

export interface ChangeChatChannelOwner {
    type: ChatChannelClientActions.ChangeChatChannelOwner;
    chatChannelId: string;
    newOwnerId: string;
}

export interface SendChatMessage {
    type: ChatChannelClientActions.SendChatMessage;
    chatChannelId: string;
    message: string;
    channelType: ChannelType;
}

export type EngineChatAction =
    | CreateChatChannel
    | DeleteChatChannel
    | AddPlayerCharacterToChatChannel
    | RemovePlayerCharacterFromChatChannel
    | LeaveChatChannel
    | ChangeChatChannelOwner
    | SendChatMessage;
