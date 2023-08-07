import { Location } from "../shared";

export interface CharacterClass {
    id: string;
    name: string;
    iconImage: string;
    healthPoints: number,
    spellPower: number,
    spells: Record<string, CharacterClassSpellAssignment>;
    color: string;
}

export interface CharacterClassPreview {
    id: string;
    name: string;
    iconImage: string;
    color: string;
}

export interface CharacterClassSpellAssignment {
    spellId: string,
    minLevel: number
}

export enum PlayerClientActions {
    CreateCharacter = "CreateCharacter",
    OpenLoot = 'OpenLoot',
    CloseLoot = 'CloseLoot',
    PickItemFromCorpse = 'PickItemFromCorpse',
    PickCoinsFromCorpse = 'PickCoinsFromCorpse',

    Package = 'Package',

    //TODO: to do spell module
    CastSpell = "CastSpell",
}

export interface CreateCharacter {
    type: PlayerClientActions.CreateCharacter;
    name: string;
    characterClassId: string;
}

export interface CastSpell {
    type: PlayerClientActions.CastSpell;
    directionLocation: Location;
    spellId: string;
    targetId: string;
}

export interface OpenLoot {
    type: PlayerClientActions.OpenLoot;
    corpseId: string;
}

export interface CloseLoot {
    type: PlayerClientActions.CloseLoot;
}

export interface PickItemFromCorpse {
    type: PlayerClientActions.PickItemFromCorpse;
    corpseId: string;
    itemId: string;
}
export interface PickCoinsFromCorpse {
    type: PlayerClientActions.PickCoinsFromCorpse;
    corpseId: string;
}

export type EnginePlayerAction = CreateCharacter | CastSpell | OpenLoot | CloseLoot | PickItemFromCorpse | PickCoinsFromCorpse;

export enum PlayerClientEvents {
    ErrorMessage = 'ErrorMessage',
}

export interface ErrorMessageEvent {
    type: PlayerClientEvents.ErrorMessage;
    message: string;
}

export type PlayerEvent = ErrorMessageEvent;