import _ from 'lodash';
import { distanceBetweenTwoPoints, areLinesIntersecting, isSegmentIntersectingWithACircle, getTheClosestObject } from '../math';
import { EngineEvents } from '../EngineEvents';
import { AREAS, BORDER } from '../../map';

export class ProjectileMovement {
   services: any;

   init(services) {
      this.services = services;
   }

   isMovementCrossingWall(movementSegment) {
      return [...BORDER, ...AREAS].find((polygon) => {
         for (let i = 0; i < polygon.length; i++) {
            if (areLinesIntersecting(movementSegment, [polygon[i], polygon[(i + 1) % polygon.length]])) {
               return true;
            }
         }
      });
   }

   calculateAngles(projectile) {
      const angle = Math.atan2(projectile.directionLocation.y - projectile.startLocation.y, projectile.directionLocation.x - projectile.startLocation.x);

      return {
         xMultiplayer: Math.cos(angle),
         yMultiplayer: Math.sin(angle),
         angle,
      };
   }

   isItOutOfRange(projectile, newLocation) {
      return distanceBetweenTwoPoints(projectile.startLocation, newLocation) > projectile.spell.range;
   }

   getCrossingCharacter(movementSegment) {
      return _.pickBy(
         _.pickBy(this.services.characterService.getAllCharacters(), (char) => !char.isDead),
         (character) => {
            return isSegmentIntersectingWithACircle(movementSegment, [character.location.x, character.location.y, character.size / 2]);
         }
      );
   }

   doAction() {
      _.each(this.services.projectilesService.getAllProjectiles(), (projectile, projectileId) => {
         const newLocation = {
            x: projectile.currentLocation.x + projectile.xMultiplayer * projectile.spell.speed,
            y: projectile.currentLocation.y + projectile.yMultiplayer * projectile.spell.speed,
         };

         const movementSegment = [
            [projectile.currentLocation.x, projectile.currentLocation.y],
            [newLocation.x, newLocation.y],
         ];

         const hitCharacters = _.filter(this.getCrossingCharacter(movementSegment), (character) => character.id !== projectile.characterId);

         if (hitCharacters.length > 0) {
            const theClossestHitCharacter = getTheClosestObject(projectile.currentLocation, hitCharacters);

            this.services.eventCreatorService.createEvent({
               type: EngineEvents.RemoveProjectile,
               projectileId,
            });
            this.services.eventCreatorService.createEvent({
               type: EngineEvents.CharacterHit,
               spell: projectile.spell,
               target: theClossestHitCharacter,
            });
         } else if (this.isItOutOfRange(projectile, newLocation) || this.isMovementCrossingWall(movementSegment)) {
            this.services.eventCreatorService.createEvent({
               type: EngineEvents.RemoveProjectile,
               projectileId,
            });
         } else {
            this.services.eventCreatorService.createEvent({
               ...projectile,
               type: EngineEvents.ProjectileMoved,
               projectileId,
               newLocation,
            });
         }
      });
   }
}
