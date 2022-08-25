export interface Module {
   data: Record<string, any>;
   recentData: Record<string, any>;
   events: [];
   lastUpdateTime: number;
}

export interface SocketAwareState {
   socketStateModule: Record<string, Module>;
}
