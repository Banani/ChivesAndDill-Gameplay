import type { EngineAwareState } from './types';

export const getEngineState = (state: EngineAwareState) => state.engineStateModule;

export const getEngineSpellsEvents = (state: EngineAwareState) => state.engineStateModule.spells.events;
