import { QuestEngineEvents } from './modules/QuestModule/Events';

export enum EngineEvents {
   CreateNewPlayer = 'CreateNewPlayer',
   NewCharacterCreated = 'NewCharacterCreated',
   PlayerDisconnected = 'PlayerDisconnected',
   PlayerStartedMovement = 'PlayerStartedMovement',
   PlayerStopedMovementVector = 'PlayerStopedMovementVector',
   PlayerStopedAllMovementVectors = 'PlayerStopedAllMovementVectors',
   PlayerMoved = 'PlayerMoved',
   PlayerTriesToStartedMovement = 'PlayerTriesToStartedMovement',
   PlayerTriesToCastASpell = 'PlayerTriesToCastASpell',
   PlayerCastedSpell = 'PlayerCastedSpell',
   ProjectileCreated = 'ProjectileCreated',
   ProjectileMoved = 'ProjectileMoved',
   RemoveProjectile = 'RemoveProjectile',
   ProjectileRemoved = 'ProjectileRemoved',
   CharacterHit = 'CharacterHit',
   CharacterLostHp = 'CharacterLostHp',
   CharacterDied = 'CharacterDied',
}
