import { ItemTemplate } from './ItemPackage';

export enum NpcClientMessages {
   OpenNpcConversationDialog = 'OpenNpcConversationDialog',
   CloseNpcConversationDialog = 'CloseNpcConversationDialog',
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

export type EngineNpcAction = OpenNpcConversationDialog | CloseNpcConversationDialog;
