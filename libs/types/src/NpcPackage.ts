import { ItemLocationInBag } from './ItemPackage';

export enum NpcClientMessages {
   OpenNpcConversationDialog = 'OpenNpcConversationDialog',
   CloseNpcConversationDialog = 'CloseNpcConversationDialog',
   BuyItemFromNpc = 'BuyItemFromNpc',
   SellItemToNpc = 'SellItemToNpc',
   PlayerTriesToTakeQuestFromNpc = 'PlayerTriesToTakeQuestFromNpc',
   FinalizeQuestWithNpc = 'FinalizeQuestWithNpc',
}

export interface ActiveNpcConversation {
   npcId: string;
}

//itemTemplateId
export type NpcStock = Record<string, boolean>;

export interface OpenNpcConversationDialog {
   type: NpcClientMessages.OpenNpcConversationDialog;
   npcId: string;
}

export interface CloseNpcConversationDialog {
   type: NpcClientMessages.CloseNpcConversationDialog;
   npcId: string;
}

export interface BuyItemFromNpc {
   type: NpcClientMessages.BuyItemFromNpc;
   npcId: string;
   itemTemplateId: string;
   amount?: number;
   desiredLocation?: ItemLocationInBag;
}

export interface SellItemToNpc {
   type: NpcClientMessages.SellItemToNpc;
   npcId: string;
   itemId: string;
}

export interface PlayerTriesToTakeQuestFromNpc {
   type: NpcClientMessages.PlayerTriesToTakeQuestFromNpc;
   npcId: string;
   questId: string;
}

export interface FinalizeQuestWithNpc {
   type: NpcClientMessages.FinalizeQuestWithNpc;
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
