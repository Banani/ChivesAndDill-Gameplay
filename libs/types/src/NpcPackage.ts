export enum NpcClientMessages {
   OpenNpcConversationDialog = 'OpenNpcConversationDialog',
   CloseNpcConversationDialog = 'CloseNpcConversationDialog',
}

export interface ActiveNpcConversation {
   npcId: string;
}

export interface OpenNpcConversationDialog {
   type: NpcClientMessages.OpenNpcConversationDialog;
   npcId: string;
}

export interface CloseNpcConversationDialog {
   type: NpcClientMessages.CloseNpcConversationDialog;
   npcId: string;
}

export type EngineNpcAction = OpenNpcConversationDialog | CloseNpcConversationDialog;
