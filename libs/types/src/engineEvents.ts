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

export enum ClientMessages {
   PlayerStartMove = 'PlayerMove',
   PlayerStopMove = 'PlayerStopMove',
   PerformBasicAttack = 'PerformBasicAttack',
   CreateCharacter = 'CreateCharacter',
   OpenLoot = 'OpenLoot',
   CloseLoot = 'CloseLoot',
}
