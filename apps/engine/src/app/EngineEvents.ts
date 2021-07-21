export enum EngineEvents {
   CreateNewPlayer = 'CreateNewPlayer',
   NewCharacterCreated = 'NewCharacterCreated',
   PlayerDisconnected = 'PlayerDisconnected',
   PlayerStartedMovement = 'PlayerStartedMovement',
   PlayerStopedMovementVector = 'PlayerStopedMovementVector',
   PlayerStopedAllMovementVectors = 'PlayerStopedAllMovementVectors',
   PlayerMoved = 'PlayerMoved',
   PlayerTriesToStartedMovement = 'PlayerTriesToStartedMovement',
   ProjectileCreated = 'ProjectileCreated',
   ProjectileMoved = 'ProjectileMoved',
   RemoveProjectile = 'RemoveProjectile',
   ProjectileRemoved = 'ProjectileRemoved',

   CharacterLostHp = 'CharacterLostHp',
   CharacterGotHp = 'CharacterGotHp',
   CharacterDied = 'CharacterDied',
   TakeCharacterHealthPoints = 'TakeCharacterHealthPoints',
   AddCharacterHealthPoints = 'AddCharacterHealthPoints',

   PlayerTriesToCastASpell = 'PlayerTriesToCastASpell',
   PlayerCastSpell = 'PlayerCastSpell',
   PlayerCastedSpell = 'PlayerCastedSpell',
   ApplySpellEffect = 'ApplySpellEffect',
}
