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
}

export enum QuestEngineMessages {
   QuestStarted = 'QuestStarted',
   QuestCompleted = 'QuestCompleted',
   KillingStagePartProgress = 'KillingStagePartProgress',
   NewQuestStageStarted = 'NewQuestStageStarted',
}

export enum FightingEngineMessages {
   SpellLanded = 'SpellLanded',
   AreaSpellEffectCreated = 'AreaSpellEffectCreated',
   AreaSpellEffectRemoved = 'AreaSpellEffectRemoved',
   ChannelingFinished = 'ChannelingFinished',
   ChannelingInterrupted = 'ChannelingInterrupted',
}

export enum ClientMessages {
   PlayerStartMove = 'PlayerMove',
   PlayerStopMove = 'PlayerStopMove',
   PerformBasicAttack = 'PerformBasicAttack',
}
