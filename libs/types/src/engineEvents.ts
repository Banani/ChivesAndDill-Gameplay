export enum EngineMessages {
  Inicialization = 'Inicialization',
  UserConnected = 'UserConnected',
  UserDisconnected = 'UserDisconnected',
  PlayerStartedMovement = 'PlayerStartedMovement',
  PlayerStoppedMovement = 'PlayerStoppedMovement',
  PlayerMoved = 'PlayerMoved',
  ProjectileCreated = 'ProjectileCreated',
  ProjectileMoved = 'ProjectileMoved',
}

export enum ClientMessages {
  PlayerStartMove = 'PlayerMove',
  PlayerStopMove = 'PlayerStopMove',
  PerformBasicAttack = 'PerformBasicAttack',
}
