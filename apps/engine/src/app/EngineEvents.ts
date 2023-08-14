export enum EngineEvents {
    PlayerStartedMovement = 'PlayerStartedMovement',
    PlayerStopedMovementVector = 'PlayerStopedMovementVector',
    PlayerStopedAllMovementVectors = 'PlayerStopedAllMovementVectors',
    CharacterMoved = 'PlayerMoved',
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
