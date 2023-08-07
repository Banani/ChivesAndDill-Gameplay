import { ItemLocationInBag } from './ItemPackage';

export interface ActiveNpcConversation {
    npcId: string;
}

//itemTemplateId
export type NpcStock = Record<string, boolean>;

export enum NpcClientActions {
    OpenNpcConversationDialog = 'OpenNpcConversationDialog',
    CloseNpcConversationDialog = 'CloseNpcConversationDialog',
    BuyItemFromNpc = 'BuyItemFromNpc',
    SellItemToNpc = 'SellItemToNpc',
    TakeQuestFromNpc = 'TakeQuestFromNpc',
    FinalizeQuestWithNpc = 'FinalizeQuestWithNpc',
}

export interface OpenNpcConversationDialog {
    type: NpcClientActions.OpenNpcConversationDialog;
    npcId: string;
}

export interface CloseNpcConversationDialog {
    type: NpcClientActions.CloseNpcConversationDialog;
    npcId: string;
}

export interface BuyItemFromNpc {
    type: NpcClientActions.BuyItemFromNpc;
    npcId: string;
    itemTemplateId: string;
    amount?: number;
    desiredLocation?: ItemLocationInBag;
}

export interface SellItemToNpc {
    type: NpcClientActions.SellItemToNpc;
    npcId: string;
    itemId: string;
}

export interface PlayerTriesToTakeQuestFromNpc {
    type: NpcClientActions.TakeQuestFromNpc;
    npcId: string;
    questId: string;
}

export interface FinalizeQuestWithNpc {
    type: NpcClientActions.FinalizeQuestWithNpc;
    npcId: string;
    questId: string;
}

export type EngineNpcAction =
    | OpenNpcConversationDialog
    | CloseNpcConversationDialog
    | BuyItemFromNpc
    | SellItemToNpc
    | PlayerTriesToTakeQuestFromNpc
    | FinalizeQuestWithNpc;
