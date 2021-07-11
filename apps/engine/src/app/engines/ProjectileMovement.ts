import _ from 'lodash';
import { distanceBetweenTwoPoints, areSegmentsIntersecting, isSegmentIntersectingWithACircle, getTheClosestObject, getSegmentsCrossingPoint } from '../math';
import { EngineEvents } from '../EngineEvents';
import { AREAS, BORDER } from '../../map';
import { Engine } from './Engine';
import { ProjectileIntersection } from './types';

export class ProjectileMovement extends Engine {
   getCrossingPointsWithWalls(movementSegment) {
      return [...BORDER, ...AREAS].reduce((prev, polygon) => {
         const intersections = [];
         for (let i = 0; i < polygon.length; i++) {
            const crossPoint = getSegmentsCrossingPoint(movementSegment, [polygon[i], polygon[(i + 1) % polygon.length]]);
            if (crossPoint !== null) {
               intersections.push(crossPoint);
            }
         }
         return prev.concat(intersections);
      }, []);
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
         const wallsInteractionPoints = this.getCrossingPointsWithWalls(movementSegment);

         const allProjectileIntersections = [
            ...hitCharacters.map((character) => ({
               type: ProjectileIntersection.CHARACTER,
               location: character.location,
               character,
            })),
            ...wallsInteractionPoints.map((crossPoint) => ({
               type: ProjectileIntersection.WALL,
               location: crossPoint,
            })),
         ];

         const theClossestIntersection = getTheClosestObject(projectile.currentLocation, allProjectileIntersections);

         if (theClossestIntersection?.type === ProjectileIntersection.CHARACTER) {
            this.eventCrator.createEvent({
               type: EngineEvents.RemoveProjectile,
               projectileId,
            });
            this.eventCrator.createEvent({
               type: EngineEvents.CharacterHit,
               spell: projectile.spell,
               target: theClossestIntersection.character,
            });
         } else if (this.isItOutOfRange(projectile, newLocation) || theClossestIntersection?.type === ProjectileIntersection.WALL) {
            this.eventCrator.createEvent({
               type: EngineEvents.RemoveProjectile,
               projectileId,
            });
         } else {
            this.eventCrator.createEvent({
               ...projectile,
               type: EngineEvents.ProjectileMoved,
               projectileId,
               newLocation,
            });
         }
      });
   }
}
