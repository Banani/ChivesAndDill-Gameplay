import { CharacterDirection } from '@bananos/types';
import { EngineEvents } from '../../EngineEvents';
import { MonsterEngineEvents } from '../../modules/MonsterModule/Events';
import { Monster } from '../../modules/MonsterModule/types';
import { QuestEngineEvents } from '../../modules/QuestModule/Events';
import { Character } from '../Character';
import { Location } from '../Location';
import { Services } from '../Services';
import { Spell, SpellEffect } from '../Spell';

export interface EngineEvent {
   type: EngineEvents | QuestEngineEvents | MonsterEngineEvents;
}

export interface PlayerCastedSpellEvent extends EngineEvent {
   casterId: string;
   spell: Spell;
}

export interface NewCharacterCreatedEvent extends EngineEvent {
   payload: {
      newCharacter: Character;
   };
}

export interface CreateNewPlayerEvent extends EngineEvent {
   payload: {
      socketId: string;
   };
}

export interface PlayerDisconnectedEvent extends EngineEvent {
   payload: {
      playerId: string;
   };
}

export interface CharacterDiedEvent extends EngineEvent {
   character: Character;
   killerId: string;
}

export interface CharacterLostHpEvent extends EngineEvent {
   characterId: string;
   amount: number;
   currentHp: number;
}

export interface CharacterGotHpEvent extends EngineEvent {
   characterId: string;
   amount: number;
   currentHp: number;
}

export interface PlayerStartedMovementEvent extends EngineEvent {
   characterId: string;
}

export interface PlayerTriesToStartedMovementEvent extends EngineEvent {
   characterId: string;
   movement: PlayerMovement;
}

interface PlayerMovement {
   y?: number;
   x?: number;
   source: string;
}

export interface PlayerStopedAllMovementVectorsEvent extends EngineEvent {
   characterId: string;
}

export interface PlayerMovedEvent extends EngineEvent {
   characterId: string;
   newCharacterDirection: CharacterDirection;
   newLocation: Location;
}

export interface PlayerTriesToCastASpellEvent extends EngineEvent {
   spellData: {
      characterId: string;
      spell: Spell;
      directionLocation: Vector;
   };
}

interface Vector {
   x: number;
   y: number;
}

export interface PlayerStopedMovementVectorEvent extends EngineEvent {
   characterId: string;
   movement: {
      source: string;
   };
}

export interface ProjectileCreatedEvent extends EngineEvent {
   projectileId: string;
   currentLocation: Location;
   spell: Spell;
}

export interface ProjectileMovedEvent extends EngineEvent {
   characterId: string;
   spell: Spell;
   directionLocation: Location;
   startLocation: Location;
   currentLocation: Location;
   xMultiplayer: number;
   yMultiplayer: number;
   angle: number;
   newLocation: Location;
   projectileId: string;
}

export interface Projectile {
   characterId: string;
   spell: Spell;
   directionLocation: Location;
   startLocation: Location;
   currentLocation: Location;
   xMultiplayer: number;
   yMultiplayer: number;
   angle: number;
}

export interface ProjectileRemovedEvent extends EngineEvent {
   projectileId: string;
}

export interface RemoveProjectileEvent extends EngineEvent {
   projectileId: string;
}

export interface PlayerCastSpellEvent extends EngineEvent {
   casterId: string;
   spell: Spell;
   directionLocation: Vector;
}

export interface ApplyTargetSpellEffectEvent extends EngineEvent {
   caster: Monster | Character;
   target: Monster | Character;
   effect: SpellEffect;
}

export interface ApplyLocationSpellEffectEvent extends EngineEvent {
   caster: Monster | Character;
   effect: SpellEffect;
   location: Location;
}

export interface TakeCharacterHealthPointsEvent extends EngineEvent {
   attackerId: string;
   characterId: string;
   amount: number;
}

export interface AddCharacterHealthPointsEvent extends EngineEvent {
   casterId: string;
   characterId: string;
   amount: number;
}

export interface RemoveAreaSpellEffectEvent extends EngineEvent {
   areaId: string;
}

export type EngineEventHandler<T> = ({ event, services }: { event: T; services: Services }) => void;

export interface EngineEventsMap {
   [EngineEvents.PlayerDisconnected]: EngineEventHandler<PlayerDisconnectedEvent>;
   [EngineEvents.CharacterDied]: EngineEventHandler<CharacterDiedEvent>;
   [EngineEvents.CharacterLostHp]: EngineEventHandler<CharacterLostHpEvent>;
   [EngineEvents.NewCharacterCreated]: EngineEventHandler<NewCharacterCreatedEvent>;
   [EngineEvents.CreateNewPlayer]: EngineEventHandler<CreateNewPlayerEvent>;
   [EngineEvents.PlayerStartedMovement]: EngineEventHandler<PlayerStartedMovementEvent>;
   [EngineEvents.PlayerTriesToStartedMovement]: EngineEventHandler<PlayerTriesToStartedMovementEvent>;
   [EngineEvents.PlayerStopedAllMovementVectors]: EngineEventHandler<PlayerStopedAllMovementVectorsEvent>;
   [EngineEvents.PlayerStopedMovementVector]: EngineEventHandler<PlayerStopedMovementVectorEvent>;
   [EngineEvents.PlayerMoved]: EngineEventHandler<PlayerMovedEvent>;
   [EngineEvents.PlayerTriesToCastASpell]: EngineEventHandler<PlayerTriesToCastASpellEvent>;
   [EngineEvents.PlayerCastedSpell]: EngineEventHandler<PlayerCastedSpellEvent>;
   [EngineEvents.ProjectileCreated]: EngineEventHandler<ProjectileCreatedEvent>;
   [EngineEvents.ProjectileMoved]: EngineEventHandler<ProjectileMovedEvent>;
   [EngineEvents.RemoveProjectile]: EngineEventHandler<RemoveProjectileEvent>;
   [EngineEvents.ProjectileRemoved]: EngineEventHandler<ProjectileRemovedEvent>;

   [EngineEvents.PlayerCastSpell]: EngineEventHandler<PlayerCastSpellEvent>;
   [EngineEvents.ApplyTargetSpellEffect]: EngineEventHandler<ApplyTargetSpellEffectEvent>;
   [EngineEvents.ApplyLocationSpellEffect]: EngineEventHandler<ApplyLocationSpellEffectEvent>;
   [EngineEvents.TakeCharacterHealthPoints]: EngineEventHandler<TakeCharacterHealthPointsEvent>;
   [EngineEvents.AddCharacterHealthPoints]: EngineEventHandler<AddCharacterHealthPointsEvent>;
   [EngineEvents.CharacterGotHp]: EngineEventHandler<CharacterGotHpEvent>;
   [EngineEvents.RemoveAreaSpellEffect]: EngineEventHandler<RemoveAreaSpellEffectEvent>;
}
