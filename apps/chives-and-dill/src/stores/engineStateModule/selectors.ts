import type { EngineAwareState } from './types';

export const getEngineState = (state: EngineAwareState) => state.engineStateModule;

export const getEngineSpellsEvents = (state: EngineAwareState) => state.engineStateModule.spells.events;

export const selectSpellChannels = (state: EngineAwareState) => state.engineStateModule.spellChannels.data;

export const selectActiveCharacterId = (state: EngineAwareState) => state.engineStateModule.activeCharacter?.data?.activeCharacterId ?? null;

export const selectCharacters = (state: EngineAwareState) => state.engineStateModule.character.data;

export const selectAreas = (state: EngineAwareState) => state.engineStateModule.areas.data.area;

export const selectCharacterPowerPointsEvents = (state: EngineAwareState) => state.engineStateModule.characterPowerPoints.events;

export const selectMapSchema = (state: EngineAwareState) => state.engineStateModule.mapSchema.data;
