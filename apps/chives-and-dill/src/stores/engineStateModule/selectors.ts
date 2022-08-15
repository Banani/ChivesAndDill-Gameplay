import type { EngineAwareState } from './types';

export const getEngineState = (state: EngineAwareState) => state.engineStateModule;

export const getEngineSpellsEvents = (state: EngineAwareState) => state.engineStateModule.spells.events;

export const selectSpellChannels = (state: EngineAwareState) => state.engineStateModule.spellChannels.data;

export const selectActiveCharacterId = (state: EngineAwareState) => state.engineStateModule.activeCharacter?.data?.activeCharacterId ?? null;

export const selectCharacters = (state: EngineAwareState) => state.engineStateModule.character.data;

export const selectAreas = (state: EngineAwareState) => state.engineStateModule.areas.data.area;

export const selectCharacterPowerPointsEvents = (state: EngineAwareState) => state.engineStateModule.characterPowerPoints.data;

export const selectMapSchema = (state: EngineAwareState) => state.engineStateModule.mapSchema.data;

export const getExperience = (state: EngineAwareState) => state.engineStateModule.experience.data;

export const getCurrency = (state: EngineAwareState) => state.engineStateModule.currency.data;

export const getCharactersMovements = (state: EngineAwareState) => state.engineStateModule.characterMovements.data;

export const getActiveConversation = (state: EngineAwareState) => state.engineStateModule.npcConversation.data;

export const getActiveLoot = (state: EngineAwareState) => state.engineStateModule.activeLoot.data;

export const getNpcQuests = (state: EngineAwareState) => state.engineStateModule.npcQuests.data;

export const getQuestDefinition = (state: EngineAwareState) => state.engineStateModule.questDefinition.data;

export const getItemTemplate = (state: EngineAwareState) => state.engineStateModule.items.data;
