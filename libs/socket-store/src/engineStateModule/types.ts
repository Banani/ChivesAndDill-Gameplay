export interface Module {
   data: Record<string, any>;
   events: [];
}

export interface EngineAwareState {
   engineStateModule: Record<string, Module>;
}
