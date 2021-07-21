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
   CharacterDied = 'CharacterDied',
}

export enum QuestEngineMessages {
   QuestStarted = 'QuestStarted',
   QuestCompleted = 'QuestCompleted',
   KillingStagePartProgress = 'KillingStagePartProgress',
   NewQuestStageStarted = 'NewQuestStageStarted',
}

export enum ClientMessages {
   PlayerStartMove = 'PlayerMove',
   PlayerStopMove = 'PlayerStopMove',
   PerformBasicAttack = 'PerformBasicAttack',
}
