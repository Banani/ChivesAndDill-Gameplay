export enum EngineEvents {
   CreateNewPlayer = 'CreateNewPlayer',
   NewPlayerCreated = 'NewPlayerCreated',
   PlayerDisconnected = 'PlayerDisconnected',
   PlayerStartedMovement = 'PlayerStartedMovement',
   PlayerStopedMovementVector = 'PlayerStopedMovementVector',
   PlayerStopedAllMovementVectors = 'PlayerStopedAllMovementVectors',
   PlayerMoved = 'PlayerMoved',
   PlayerTriesToStartedMovement = 'PlayerTriesToStartedMovement',

   CharacterDied = 'CharacterDied',

   CreatePath = 'CreatePath',
   UpdatePath = 'UpdatePath',
   DeletePath = 'DeletePath',
   ScheduleAction = 'ScheduleAction',
   CancelScheduledAction = 'CancelScheduledAction',
   ScheduleActionTriggered = 'ScheduleActionTriggered',
   ScheduleActionFinished = 'ScheduleActionFinished',
}
