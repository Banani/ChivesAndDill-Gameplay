import { pickBy, each, filter } from 'lodash';
import { distanceBetweenTwoPoints, isSegmentIntersectingWithACircle, getTheClosestObject, getSegmentsCrossingPoint, getCrossingPointsWithWalls } from '../math';
import { EngineEvents } from '../EngineEvents';
import { AREAS, BORDER } from '../../map';
import { Engine } from './Engine';
import { ProjectileIntersection } from './types';
import { CharacterHitEvent, ProjectileMovedEvent, RemoveProjectileEvent } from '../types';

export class ProjectileMovement extends Engine {
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
      return pickBy(
         pickBy({ ...this.services.characterService.getAllCharacters(), ...this.services.monsterService.getAllCharacters() }, (char) => !char.isDead),
         (character) => {
            return isSegmentIntersectingWithACircle(movementSegment, [character.location.x, character.location.y, character.size / 2]);
         }
      );
   }

   doAction() {
      each(this.services.projectilesService.getAllProjectiles(), (projectile, projectileId) => {
         const newLocation = {
            x: projectile.currentLocation.x + projectile.xMultiplayer * projectile.spell.speed,
            y: projectile.currentLocation.y + projectile.yMultiplayer * projectile.spell.speed,
         };

         const movementSegment = [
            [projectile.currentLocation.x, projectile.currentLocation.y],
            [newLocation.x, newLocation.y],
         ];

         const hitCharacters = filter(this.getCrossingCharacter(movementSegment), (character) => character.id !== projectile.characterId);
         const wallsInteractionPoints = getCrossingPointsWithWalls(movementSegment);

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
            this.eventCrator.createEvent<RemoveProjectileEvent>({
               type: EngineEvents.RemoveProjectile,
               projectileId,
            });
            this.eventCrator.createEvent<CharacterHitEvent>({
               type: EngineEvents.CharacterHit,
               spell: projectile.spell,
               target: theClossestIntersection.character,
               attackerId: projectile.characterId,
            });
         } else if (this.isItOutOfRange(projectile, newLocation) || theClossestIntersection?.type === ProjectileIntersection.WALL) {
            this.eventCrator.createEvent<RemoveProjectileEvent>({
               type: EngineEvents.RemoveProjectile,
               projectileId,
            });
         } else {
            this.eventCrator.createEvent<ProjectileMovedEvent>({
               ...projectile,
               type: EngineEvents.ProjectileMoved,
               projectileId,
               newLocation,
            });
         }
      });
   }
}
