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
  CharacterDied = 'CharacterDied',
}

export enum ClientMessages {
  PlayerStartMove = 'PlayerMove',
  PlayerStopMove = 'PlayerStopMove',
  PerformBasicAttack = 'PerformBasicAttack',
}
