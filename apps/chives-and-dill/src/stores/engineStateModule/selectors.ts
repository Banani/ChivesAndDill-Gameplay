import type { EngineAwareState } from './types';

export const getEngineState = (state: EngineAwareState) => state.engineStateModule;

export const getEngineSpellsEvents = (state: EngineAwareState) => state.engineStateModule.spells.events;

export const selectActiveCharacterId = (state: EngineAwareState) => state.engineStateModule.activeCharacter?.data?.activeCharacterId ?? null;

export const selectCharacters = (state: EngineAwareState) => state.engineStateModule.character.data;

export const selectAreas = (state: EngineAwareState) => state.engineStateModule.areas.data.area;
