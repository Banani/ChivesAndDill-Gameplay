import { CharacterDirection } from '@bananos/types';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import {
   CharacterDiedEvent,
   CharacterType,
   EngineEventHandler,
   PlayerMovedEvent,
   PlayerStartedMovementEvent,
   PlayerStopedAllMovementVectorsEvent,
} from '../../../types';
import { CharacterEngineEvents, ResetCharacterEvent } from '../../CharacterModule/Events';
import {
   MonsterEngineEvents,
   CreateNewMonsterEvent,
   NewMonsterCreatedEvent,
   MonsterTargetChangedEvent,
   MonsterLostTargetEvent,
   MonsterDiedEvent,
   MonsterLostAggroEvent,
} from '../Events';
import { Monster } from '../types';

export class MonsterService extends EventParser {
   monsters: Record<string, Monster> = {};
   increment = 0;

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [MonsterEngineEvents.CreateNewMonster]: this.handleCreateNewMonster,
         [MonsterEngineEvents.MonsterTargetChanged]: this.test,
         [MonsterEngineEvents.MonsterLostTarget]: this.test2,
         [MonsterEngineEvents.MonsterLostAggro]: this.handleMonsterLostAggro,
         [EngineEvents.PlayerMoved]: this.handlePlayerMoved,
         [EngineEvents.PlayerStartedMovement]: this.handlePlayerStartedMovement,
         [EngineEvents.PlayerStopedAllMovementVectors]: this.handlePlayerStopedAllMovementVectors,
      };
   }

   handlePlayerStartedMovement: EngineEventHandler<PlayerStartedMovementEvent> = ({ event }) => {
      if (this.monsters[event.characterId]) {
         this.monsters[event.characterId].isInMove = true;
      }
   };

   handlePlayerStopedAllMovementVectors: EngineEventHandler<PlayerStopedAllMovementVectorsEvent> = ({ event }) => {
      if (this.monsters[event.characterId]) {
         this.monsters[event.characterId].isInMove = false;
      }
   };

   test: EngineEventHandler<MonsterTargetChangedEvent> = ({ event }) => {
      console.log('targetChanged:', event.newTargetId);
   };
   test2: EngineEventHandler<MonsterLostTargetEvent> = ({ event }) => {
      console.log('targetLost:', event.targetId);
   };

   handlePlayerMoved: EngineEventHandler<PlayerMovedEvent> = ({ event }) => {
      if (this.monsters[event.characterId]) {
         this.monsters[event.characterId].location = event.newLocation;
         this.monsters[event.characterId].direction = event.newCharacterDirection;
      }
   };

   handleCreateNewMonster: EngineEventHandler<CreateNewMonsterEvent> = ({ event }) => {
      const id = `monster_${(this.increment++).toString()}`;
      this.monsters[id] = {
         type: CharacterType.Monster,
         id,
         name: event.monsterRespawn.monsterTemplate.name,
         location: event.monsterRespawn.location,
         sprites: event.monsterRespawn.monsterTemplate.sprites,
         size: event.monsterRespawn.monsterTemplate.size,
         direction: CharacterDirection.DOWN,
         division: event.monsterRespawn.monsterTemplate.division,
         isInMove: false,
         respawnId: event.monsterRespawn.id,
         sightRange: event.monsterRespawn.monsterTemplate.sightRange,
         speed: event.monsterRespawn.monsterTemplate.speed,
         desiredRange: event.monsterRespawn.monsterTemplate.desiredRange,
         escapeRange: event.monsterRespawn.monsterTemplate.escapeRange,
         spells: event.monsterRespawn.monsterTemplate.spells,
         attackFrequency: event.monsterRespawn.monsterTemplate.attackFrequency,
         healthPointsRegen: event.monsterRespawn.monsterTemplate.healthPointsRegen,
         spellPowerRegen: event.monsterRespawn.monsterTemplate.spellPowerRegen,
      };
      this.engineEventCrator.asyncCeateEvent<NewMonsterCreatedEvent>({
         type: MonsterEngineEvents.NewMonsterCreated,
         monster: this.monsters[id],
      });
   };

   handleMonsterLostAggro: EngineEventHandler<MonsterLostAggroEvent> = ({ event }) => {
      if (this.monsters[event.monsterId]) {
         this.engineEventCrator.asyncCeateEvent<ResetCharacterEvent>({
            type: CharacterEngineEvents.ResetCharacter,
            characterId: event.monsterId,
         });
      }
   };

   CharacterDied: EngineEventHandler<CharacterDiedEvent> = ({ event }) => {
      delete this.monsters[event.characterId];
   };

   getAllCharacters = () => this.monsters;
}
