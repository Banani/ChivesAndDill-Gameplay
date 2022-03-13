export interface ChatChannel {
   id?: string;
   name: string;
   characterOwnerId: string | null;
   membersIds: Record<string, boolean>;
}

export interface ChatMessage {
   id: string;
   time: number;
   authorId: string;
   message: string;
   chatChannelId: string;
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
}

export type EngineChatAction =
   | CreateChatChannel
   | DeleteChatChannel
   | InvitePlayerCharacterToChatChannel
   | RemovePlayerCharacterFromChatChannel
   | LeaveChatChannel
   | ChangeChatChannelOwner
   | SendChatMessage;
