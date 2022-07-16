import type { EngineAwareState } from './types';

export const getEngineState = (state: EngineAwareState) => state.engineStateModule;

export const getModuleData = (moduleName: string) => (state: EngineAwareState) => getEngineState(state)[moduleName].data;
