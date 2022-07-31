import { CharacterDirection, Location } from '@bananos/types';
import { forEach } from 'lodash';
import { Engine } from '../../../Engine';
import { EngineEvents } from '../../../EngineEvents';
import { distanceBetweenTwoPoints } from '../../../math';
import { PlayerMovedEvent, PlayerStartedMovementEvent, PlayerStopedAllMovementVectorsEvent } from '../../../types';
import { WalkingType } from '../../../types/CharacterRespawn';
import { Monster } from '../types';

interface Patrol {
   currentPoint: number;
}

export class MonsterMovementEngine extends Engine {
   walkingHandler: Record<WalkingType, (monster: Monster) => void>;
   patrolTrack: Record<string, Patrol> = {};

   constructor() {
      super();
      this.walkingHandler = {
         [WalkingType.None]: this.none,
         [WalkingType.Patrol]: this.patrol,
         [WalkingType.Stroll]: this.stroll,
      };
   }

   stopIdleWalking = (monsterId: string) => {
      delete this.patrolTrack[monsterId];
   };

   startIdleWalking = (monsterId: string) => {
      const monster = this.services.monsterService.getAllCharacters()[monsterId];

      this.eventCrator.createEvent<PlayerStartedMovementEvent>({
         type: EngineEvents.PlayerStartedMovement,
         characterId: monster.id,
      });
   };

   none = (monster: Monster) => {
      const monsterRespawns = this.services.monsterRespawnTemplateService.getData();
      const respawn = monsterRespawns[monster.respawnId];

      if (distanceBetweenTwoPoints(monster.location, respawn.location) <= monster.speed) {
         this.eventCrator.createEvent<PlayerMovedEvent>({
            type: EngineEvents.PlayerMoved,
            characterId: monster.id,
            newCharacterDirection: CharacterDirection.DOWN,
            newLocation: respawn.location,
         });

         this.eventCrator.createEvent<PlayerStopedAllMovementVectorsEvent>({
            type: EngineEvents.PlayerStopedAllMovementVectors,
            characterId: monster.id,
         });
      } else {
         const xDistance = respawn.location.x - monster.location.x;
         const yDistance = respawn.location.y - monster.location.y;
         const offset = {
            x: Math.min(monster.speed / 2, Math.abs(xDistance)) * Math.sign(xDistance),
            y: Math.min(monster.speed / 2, Math.abs(yDistance)) * Math.sign(yDistance),
         };
         const newLocation = {
            x: monster.location.x + offset.x,
            y: monster.location.y + offset.y,
         };

         this.eventCrator.createEvent<PlayerMovedEvent>({
            type: EngineEvents.PlayerMoved,
            characterId: monster.id,
            newCharacterDirection: this.getNewDirection(offset),
            newLocation,
         });
      }
   };

   patrol = (monster: Monster) => {
      const monsterRespawns = this.services.monsterRespawnTemplateService.getData();
      const respawn = monsterRespawns[monster.respawnId];

      if (!this.patrolTrack[monster.id]) {
         this.patrolTrack[monster.id] = { currentPoint: 0 };
         this.eventCrator.createEvent<PlayerStartedMovementEvent>({
            type: EngineEvents.PlayerStartedMovement,
            characterId: monster.id,
         });
      }

      if (!respawn.patrolPath?.length) {
         console.log('Patrol path is required for Patrol walking type');
         return;
      }

      const directionPatrolPoint = respawn.patrolPath[this.patrolTrack[monster.id].currentPoint];
      let newLocation: Location;
      let newDirection: CharacterDirection = monster.direction;

      if (distanceBetweenTwoPoints(monster.location, directionPatrolPoint) <= monster.speed) {
         newLocation = directionPatrolPoint;
         this.patrolTrack[monster.id].currentPoint = (this.patrolTrack[monster.id].currentPoint + 1) % respawn.patrolPath.length;
      } else {
         const xDistance = directionPatrolPoint.x - monster.location.x;
         const yDistance = directionPatrolPoint.y - monster.location.y;
         const offset = {
            x: Math.min(monster.speed / 4, Math.abs(xDistance)) * Math.sign(xDistance),
            y: Math.min(monster.speed / 4, Math.abs(yDistance)) * Math.sign(yDistance),
         };
         newLocation = {
            x: monster.location.x + offset.x,
            y: monster.location.y + offset.y,
         };
         newDirection = this.getNewDirection(offset);
      }

      this.eventCrator.createEvent<PlayerMovedEvent>({
         type: EngineEvents.PlayerMoved,
         characterId: monster.id,
         newCharacterDirection: newDirection,
         newLocation,
      });
   };

   stroll(monster: Monster) {}

   getNewDirection(lastMovement) {
      return {
         [(lastMovement.x > 0).toString()]: CharacterDirection.RIGHT,
         [(lastMovement.x < 0).toString()]: CharacterDirection.LEFT,
         [(lastMovement.y > 0).toString()]: CharacterDirection.DOWN,
         [(lastMovement.y < 0).toString()]: CharacterDirection.UP,
      }['true'];
   }

   chasing(monster: Monster, targetId: string) {
      const allCharacters = { ...this.services.characterService.getAllCharacters(), ...this.services.monsterService.getAllCharacters() };

      if (distanceBetweenTwoPoints(allCharacters[targetId].location, monster.location) <= monster.desiredRange) {
         this.eventCrator.createEvent<PlayerStopedAllMovementVectorsEvent>({
            type: EngineEvents.PlayerStopedAllMovementVectors,
            characterId: monster.id,
         });
         return;
      }

      if (this.services.channelService.willMovementInterruptCasting(monster.id)) {
         return;
      }

      this.eventCrator.createEvent<PlayerStartedMovementEvent>({
         type: EngineEvents.PlayerStartedMovement,
         characterId: monster.id,
      });

      const direction = this.services.pathFinderService.getNextDirection(monster.id);

      if (direction) {
         const xDistance = direction.x - monster.location.x;
         const yDistance = direction.y - monster.location.y;

         const offset = {
            x: Math.min(monster.speed, Math.abs(xDistance)) * Math.sign(xDistance),
            y: Math.min(monster.speed, Math.abs(yDistance)) * Math.sign(yDistance),
         };

         this.eventCrator.createEvent<PlayerMovedEvent>({
            type: EngineEvents.PlayerMoved,
            characterId: monster.id,
            newCharacterDirection: this.getNewDirection(offset),
            newLocation: {
               x: monster.location.x + offset.x,
               y: monster.location.y + offset.y,
            },
         });
      }
   }

   doAction() {
      forEach(this.services.monsterService.getAllCharacters(), (monster, key) => {
         const aggro = this.services.aggroService.getMonsterAggro();

         if (aggro[key]) {
            this.chasing(monster, aggro[key].currentTarget.characterId);
         } else {
            const monsterRespawns = this.services.monsterRespawnTemplateService.getData();
            const respawn = monsterRespawns[monster.respawnId];
            this.walkingHandler[respawn.walkingType](monster);
         }
      });
   }
}
