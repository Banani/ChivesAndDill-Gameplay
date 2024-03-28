import {
    AcceptInvite,
    AddPlayerCharacterToChatChannel,
    BuyItemFromNpc,
    ChangeChatChannelOwner,
    CharacterClientActions,
    ChatChannelClientActions,
    CloseLoot,
    CloseNpcConversationDialog,
    CreateCharacter,
    CreateChatChannel,
    DeclineInvite,
    DeleteChatChannel,
    FinalizeQuestWithNpc,
    GroupClientActions,
    InviteToParty,
    LeaveChatChannel,
    LeaveParty,
    NpcClientActions,
    OpenLoot,
    OpenNpcConversationDialog,
    PickCoinsFromCorpse,
    PickItemFromCorpse,
    PlayerClientActions,
    PlayerStartMove,
    PlayerStopMove,
    PromoteToLeader,
    RemovePlayerCharacterFromChatChannel,
    SellItemToNpc,
    TakeQuestFromNpc,
    UninviteFromParty
} from "@bananos/types";
import { EngineActionHandler } from "./types";

export interface CharacterActionsMap {
    [CharacterClientActions.PlayerStartMove]: EngineActionHandler<PlayerStartMove>;
    [CharacterClientActions.PlayerStopMove]: EngineActionHandler<PlayerStopMove>;
}

export interface PlayerActionsMap {
    [PlayerClientActions.CreatePlayerCharacter]: EngineActionHandler<CreateCharacter>;
    [PlayerClientActions.OpenLoot]: EngineActionHandler<OpenLoot>;
    [PlayerClientActions.CloseLoot]: EngineActionHandler<CloseLoot>;
    [PlayerClientActions.PickCoinsFromCorpse]: EngineActionHandler<PickCoinsFromCorpse>;
    [PlayerClientActions.PickItemFromCorpse]: EngineActionHandler<PickItemFromCorpse>;
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

export interface GroupActionsMap {
    [GroupClientActions.InviteToParty]: EngineActionHandler<InviteToParty>;
    [GroupClientActions.PromoteToLeader]: EngineActionHandler<PromoteToLeader>;
    [GroupClientActions.UninviteFromParty]: EngineActionHandler<UninviteFromParty>;
    [GroupClientActions.AcceptInvite]: EngineActionHandler<AcceptInvite>;
    [GroupClientActions.DeclineInvite]: EngineActionHandler<DeclineInvite>
    [GroupClientActions.LeaveParty]: EngineActionHandler<LeaveParty>
}

export type EngineActionsMap = CharacterActionsMap & PlayerActionsMap & ChatActionsMap & NpcActionsMap & GroupActionsMap;