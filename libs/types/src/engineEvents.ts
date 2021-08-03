export enum EngineMessages {
   Inicialization = 'Inicialization',
   UserConnected = 'UserConnected',
   UserDisconnected = 'UserDisconnected',
   PlayerStartedMovement = 'PlayerStartedMovement',
   PlayerStoppedMovement = 'PlayerStoppedMovement',
   PlayerMoved = 'PlayerMoved',
   ProjectileCreated = 'ProjectileCreated',
   ProjectileMoved = 'ProjectileMoved',
   ProjectileRemoved = 'ProjectileRemoved',
   CharacterLostHp = 'CharacterLostHp',
   CharacterGotHp = 'CharacterGotHp',
   CharacterLostSpellPower = 'CharacterLostSpellPower',
   CharacterGotSpellPower = 'CharacterGotSpellPower',
   CharacterDied = 'CharacterDied',

   Package = 'Package',
}

export enum QuestEngineMessages {
   QuestStarted = 'QuestStarted',
   QuestCompleted = 'QuestCompleted',
   KillingStagePartProgress = 'KillingStagePartProgress',
   NewQuestStageStarted = 'NewQuestStageStarted',
}

export enum FightingEngineMessages {
   SpellHasBeenCast = 'SpellHasBeenCast',
   SpellLanded = 'SpellLanded',
   AreaSpellEffectCreated = 'AreaSpellEffectCreated',
   AreaSpellEffectRemoved = 'AreaSpellEffectRemoved',
   ChannelingFinished = 'ChannelingFinished',
   ChannelingInterrupted = 'ChannelingInterrupted',
   CharacterGainPowerStack = 'CharacterGainPowerStack',
   CharacterLosePowerStack = 'CharacterLosePowerStack',
   DamageAbsorbed = 'DamageAbsorbed',
   AbsorbShieldChanged = 'AbsorbShieldChanged',
}

export enum ClientMessages {
   PlayerStartMove = 'PlayerMove',
   PlayerStopMove = 'PlayerStopMove',
   PerformBasicAttack = 'PerformBasicAttack',
}
