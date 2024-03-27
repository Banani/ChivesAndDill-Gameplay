import {
    AddPlayerCharacterToChatChannel,
    BuyItemFromNpc,
    ChangeChatChannelOwner,
    CharacterClientActions,
    ChatChannelClientActions,
    CloseNpcConversationDialog,
    CreateCharacter,
    CreateChatChannel,
    DeleteChatChannel,
    FinalizeQuestWithNpc,
    LeaveChatChannel,
    NpcClientActions,
    OpenNpcConversationDialog,
    PlayerClientActions,
    PlayerStartMove,
    PlayerStopMove,
    RemovePlayerCharacterFromChatChannel,
    SellItemToNpc,
    TakeQuestFromNpc
} from "@bananos/types";
import { EngineActionHandler } from "./types";

export interface CharacterActionsMap {
    [CharacterClientActions.PlayerStartMove]: EngineActionHandler<PlayerStartMove>;
    [CharacterClientActions.PlayerStopMove]: EngineActionHandler<PlayerStopMove>;
}

export interface PlayerActionsMap {
    [PlayerClientActions.CreatePlayerCharacter]: EngineActionHandler<CreateCharacter>;
}

export interface ChatActionsMap {
    // [ChatChannelClientActions.SendChatMessage]: EngineActionHandler<SendChatMessage>;
    [ChatChannelClientActions.CreateChatChannel]: EngineActionHandler<CreateChatChannel>;
    [ChatChannelClientActions.DeleteChatChannel]: EngineActionHandler<DeleteChatChannel>;
    [ChatChannelClientActions.AddPlayerCharacterToChatChannel]: EngineActionHandler<AddPlayerCharacterToChatChannel>;
    [ChatChannelClientActions.RemovePlayerCharacterFromChatChannel]: EngineActionHandler<RemovePlayerCharacterFromChatChannel>;
    [ChatChannelClientActions.LeaveChatChannel]: EngineActionHandler<LeaveChatChannel>;
    [ChatChannelClientActions.ChangeChatChannelOwner]: EngineActionHandler<ChangeChatChannelOwner>;
}

export interface NpcActionsMap {
    [NpcClientActions.OpenNpcConversationDialog]: EngineActionHandler<OpenNpcConversationDialog>;
    [NpcClientActions.CloseNpcConversationDialog]: EngineActionHandler<CloseNpcConversationDialog>;
    [NpcClientActions.BuyItemFromNpc]: EngineActionHandler<BuyItemFromNpc>;
    [NpcClientActions.SellItemToNpc]: EngineActionHandler<SellItemToNpc>;
    [NpcClientActions.TakeQuestFromNpc]: EngineActionHandler<TakeQuestFromNpc>
    [NpcClientActions.FinalizeQuestWithNpc]: EngineActionHandler<FinalizeQuestWithNpc>
}

export type EngineActionsMap = CharacterActionsMap & PlayerActionsMap & ChatActionsMap & NpcActionsMap;