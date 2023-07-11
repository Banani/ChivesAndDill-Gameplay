import { ChatChannelClientMessages } from './ChatPackage';
import { ItemClientMessages } from './ItemPackage';

export enum EngineMessages {
    Inicialization = 'Inicialization',
    UserConnected = 'UserConnected',
    UserDisconnected = 'UserDisconnected',

    CharacterLostHp = 'CharacterLostHp', // READY
    CharacterGotHp = 'CharacterGotHp', // READY
    CharacterLostSpellPower = 'CharacterLostSpellPower', // READY
    CharacterGotSpellPower = 'CharacterGotSpellPower', // READY

    CharacterDied = 'CharacterDied',

    Package = 'Package', // READY
}

export enum QuestEngineMessages { //TODO: Mozliwe ze to juz do wywalenia
    QuestStarted = 'QuestStarted',
    QuestCompleted = 'QuestCompleted',
    KillingStagePartProgress = 'KillingStagePartProgress',
    NewQuestStageStarted = 'NewQuestStageStarted',
}

export enum FightingEngineMessages {
    SpellHasBeenCast = 'SpellHasBeenCast',
    SpellLanded = 'SpellLanded', // READY
    AreaSpellEffectCreated = 'AreaSpellEffectCreated', // READY
    AreaSpellEffectRemoved = 'AreaSpellEffectRemoved', // READY

    ChannelingFinished = 'ChannelingFinished', // READY
    ChannelingInterrupted = 'ChannelingInterrupted', // READY

    CharacterGainPowerStack = 'CharacterGainPowerStack', // READY
    CharacterLosePowerStack = 'CharacterLosePowerStack', // READY
    DamageAbsorbed = 'DamageAbsorbed',
    AbsorbShieldChanged = 'AbsorbShieldChanged',
}

export enum CommonClientMessages {
    PlayerStartMove = 'PlayerMove',
    PlayerStopMove = 'PlayerStopMove',
    CreateCharacter = 'CreateCharacter',
    OpenLoot = 'OpenLoot',
    CloseLoot = 'CloseLoot',
    PickItemFromCorpse = 'PickItemFromCorpse',
    PickCoinsFromCorpse = 'PickCoinsFromCorpse',
}

export interface PlayerStartMove {
    type: CommonClientMessages.PlayerStartMove;
    y?: number;
    x?: number;
    source: string;
}

export interface PlayerStopMove {
    type: CommonClientMessages.PlayerStopMove;
    source: string;
}

export interface CreateCharacter {
    type: CommonClientMessages.CreateCharacter;
    name: string;
    characterClassId: string;
}

export interface OpenLoot {
    type: CommonClientMessages.OpenLoot;
    corpseId: string;
}

export interface CloseLoot {
    type: CommonClientMessages.CloseLoot;
}

export interface PickItemFromCorpse {
    type: CommonClientMessages.PickItemFromCorpse;
    corpseId: string;
    itemId: string;
}
export interface PickCoinsFromCorpse {
    type: CommonClientMessages.PickCoinsFromCorpse;
    corpseId: string;
}


export type CommonClientActions = PlayerStartMove | PlayerStopMove | CreateCharacter | OpenLoot | PickItemFromCorpse | PickCoinsFromCorpse | CloseLoot;

export type ClientMessages = CommonClientMessages | ChatChannelClientMessages | ItemClientMessages;
