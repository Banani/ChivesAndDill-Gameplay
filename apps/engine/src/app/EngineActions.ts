import { AddPlayerCharacterToChatChannel, BuyItemFromNpc, CharacterClientActions, ChatChannelClientActions, CloseNpcConversationDialog, CreateCharacter, CreateChatChannel, DeleteChatChannel, NpcClientActions, OpenNpcConversationDialog, PlayerClientActions, PlayerStartMove, PlayerStopMove, SellItemToNpc } from "@bananos/types";
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
}

export interface NpcActionsMap {
    [NpcClientActions.OpenNpcConversationDialog]: EngineActionHandler<OpenNpcConversationDialog>;
    [NpcClientActions.CloseNpcConversationDialog]: EngineActionHandler<CloseNpcConversationDialog>;
    [NpcClientActions.BuyItemFromNpc]: EngineActionHandler<BuyItemFromNpc>;
    [NpcClientActions.SellItemToNpc]: EngineActionHandler<SellItemToNpc>;
}

export type EngineActionsMap = CharacterActionsMap & PlayerActionsMap & ChatActionsMap & NpcActionsMap;