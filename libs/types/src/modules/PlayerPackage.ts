
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
    CreatePlayerCharacter = "CreatePlayerCharacter",
    OpenLoot = 'OpenLoot',
    CloseLoot = 'CloseLoot',
    PickItemFromCorpse = 'PickItemFromCorpse',
    PickCoinsFromCorpse = 'PickCoinsFromCorpse',

    Package = 'Package'
}

export interface CreateCharacter {
    type: PlayerClientActions.CreatePlayerCharacter;
    name: string;
    characterClassId: string;
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

export type EnginePlayerAction = CreateCharacter | OpenLoot | CloseLoot | PickItemFromCorpse | PickCoinsFromCorpse;

export enum PlayerClientEvents {
    ErrorMessage = 'ErrorMessage',
}

export interface ErrorMessageEvent {
    type: PlayerClientEvents.ErrorMessage;
    message: string;
}

export type PlayerEvent = ErrorMessageEvent;