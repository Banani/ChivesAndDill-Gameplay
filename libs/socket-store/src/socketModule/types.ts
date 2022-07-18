export interface Module {
   data: Record<string, any>;
   events: [];
}

export interface SocketAwareState {
   socketStateModule: Record<string, Module>;
}
