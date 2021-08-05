import { EngineAwareState } from './types';

export const getEngineState = (state: EngineAwareState) => state.engineStateModule;
