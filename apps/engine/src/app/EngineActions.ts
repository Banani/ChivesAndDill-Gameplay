import {
    AcceptInvite,
    AddPlayerCharacterToChatChannel,
    BuyItemFromNpc,
    CastSpell,
    ChangeChatChannelOwner,
    CharacterClientActions,
    ChatChannelClientActions,
    CloseLoot,
    CloseNpcConversationDialog,
    CreateCharacter,
    CreateChatChannel,
    DeclineInvite,
    DeleteChatChannel,
    DeleteItem,
    EquipItem,
    FinalizeQuestWithNpc,
    GroupClientActions,
    InviteToParty,
    ItemClientActions,
    LeaveChatChannel,
    LeaveParty,
    MoveItemInBag,
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
    RequestItemTemplates,
    RequestSpellDefinitions,
    SellItemToNpc,
    SpellClientActions,
    SplitItemStackInBag,
    StripItem,
    TakeQuestFromNpc,
    UninviteFromParty
} from "@bananos/types";
import { EngineActionHandler } from "./types";

export interface CharacterActionsMap {
    [CharacterClientActions.PlayerStartMove]: EngineActionHandler<PlayerStartMove>;
    [CharacterClientActions.PlayerStopMove]: EngineActionHandler<PlayerStopMove>;
}

export interface SpellActionsMap {
    [SpellClientActions.CastSpell]: EngineActionHandler<CastSpell>;
    [SpellClientActions.RequestSpellDefinitions]: EngineActionHandler<RequestSpellDefinitions>;
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

export interface ItemActionsMap {
    [ItemClientActions.DeleteItem]: EngineActionHandler<DeleteItem>;
    [ItemClientActions.EquipItem]: EngineActionHandler<EquipItem>;
    [ItemClientActions.MoveItemInBag]: EngineActionHandler<MoveItemInBag>;
    [ItemClientActions.RequestItemTemplates]: EngineActionHandler<RequestItemTemplates>;
    [ItemClientActions.SplitItemStackInBag]: EngineActionHandler<SplitItemStackInBag>
    [ItemClientActions.StripItem]: EngineActionHandler<StripItem>
}

export type EngineActionsMap = CharacterActionsMap & PlayerActionsMap & ChatActionsMap & NpcActionsMap & GroupActionsMap & ItemActionsMap & SpellActionsMap;