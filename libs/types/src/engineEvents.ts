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

export enum QuestEngineMessages {
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
   PerformBasicAttack = 'PerformBasicAttack',
   CreateCharacter = 'CreateCharacter',
   OpenLoot = 'OpenLoot',
   CloseLoot = 'CloseLoot',
   TakeLootItem = 'TakeLootItem',
}

export interface OpenLoot {
   type: CommonClientMessages.OpenLoot;
   corpseId: string;
}

export interface CloseLoot {
   type: CommonClientMessages.CloseLoot;
}

export type CommonClientActions = OpenLoot | CloseLoot;

export type ClientMessages = CommonClientMessages | ChatChannelClientMessages | ItemClientMessages;
