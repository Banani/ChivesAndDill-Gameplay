import { CharacterDirection } from '@bananos/types';
import { forEach } from 'lodash';
import { Engine } from '../../../Engine';
import { EngineEvents } from '../../../EngineEvents';
import { distanceBetweenTwoPoints } from '../../../math';
import { PlayerMovedEvent, PlayerStartedMovementEvent, PlayerStopedAllMovementVectorsEvent } from '../../../types';

export class MonsterMovementEngine extends Engine {
   getNewDirection(lastMovement) {
      return {
         [(lastMovement.x > 0).toString()]: CharacterDirection.RIGHT,
         [(lastMovement.x < 0).toString()]: CharacterDirection.LEFT,
         [(lastMovement.y > 0).toString()]: CharacterDirection.DOWN,
         [(lastMovement.y < 0).toString()]: CharacterDirection.UP,
      }['true'];
   }

   doAction() {
      forEach(this.services.aggroService.getMonsterAggro(), (aggro, key) => {
         const allCharacters = { ...this.services.characterService.getAllCharacters(), ...this.services.monsterService.getAllCharacters() };
         const monster = this.services.monsterService.getAllCharacters()[key];

         if (distanceBetweenTwoPoints(allCharacters[aggro.currentTarget.characterId].location, monster.location) <= monster.desiredRange) {
            this.eventCrator.createEvent<PlayerStopedAllMovementVectorsEvent>({
               type: EngineEvents.PlayerStopedAllMovementVectors,
               characterId: monster.id,
            });
            return;
         }

         this.eventCrator.createEvent<PlayerStartedMovementEvent>({
            type: EngineEvents.PlayerStartedMovement,
            characterId: monster.id,
         });

         const direction = this.services.pathFinderService.getNextDirection(key);
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
      });
   }
}
