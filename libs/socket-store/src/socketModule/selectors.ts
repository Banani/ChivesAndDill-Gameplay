import type { SocketAwareState } from './types';

export const getEngineState = (state: SocketAwareState) => state.socketStateModule;

export const getModuleData = (moduleName: string) => (state: SocketAwareState) => getEngineState(state)[moduleName].data;
