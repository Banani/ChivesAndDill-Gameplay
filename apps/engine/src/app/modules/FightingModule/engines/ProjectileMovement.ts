import { pickBy, each, filter, forEach } from 'lodash';
import { EngineEvents } from '../../../EngineEvents';
import { Engine } from '../../../engines/Engine';
import { ProjectileIntersection } from '../../../engines/types';
import { distanceBetweenTwoPoints, isSegmentIntersectingWithACircle, getCrossingPointsWithWalls, getTheClosestObject } from '../../../math';
import { RemoveProjectileEvent, ProjectileMovedEvent, ApplyTargetSpellEffectEvent } from '../../../types';
import { FightingEngineEvents, SpellLandedEvent, SpellReachedTargetEvent } from '../Events';

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

            this.eventCrator.createEvent<SpellLandedEvent>({
               type: FightingEngineEvents.SpellLanded,
               spell: projectile.spell,
               caster: { ...this.services.characterService.getAllCharacters(), ...this.services.monsterService.getAllCharacters() }[projectile.characterId],
               location: theClossestIntersection.character.location,
            });

            this.eventCrator.createEvent<SpellReachedTargetEvent>({
               type: FightingEngineEvents.SpellReachedTarget,
               spell: projectile.spell,
               caster: { ...this.services.characterService.getAllCharacters(), ...this.services.monsterService.getAllCharacters() }[projectile.characterId],
               target: theClossestIntersection.character,
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
