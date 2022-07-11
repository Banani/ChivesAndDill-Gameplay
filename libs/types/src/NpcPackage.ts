import { ItemLocationInBag, ItemTemplate } from './ItemPackage';

export enum NpcClientMessages {
   OpenNpcConversationDialog = 'OpenNpcConversationDialog',
   CloseNpcConversationDialog = 'CloseNpcConversationDialog',
   BuyItemFromNpc = 'BuyItemFromNpc',
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

export type EngineNpcAction = OpenNpcConversationDialog | CloseNpcConversationDialog | BuyItemFromNpc;
