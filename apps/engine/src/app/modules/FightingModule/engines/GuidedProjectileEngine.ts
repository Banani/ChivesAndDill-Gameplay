import { pickBy, each, find, forEach } from 'lodash';
import { EngineEvents } from '../../../EngineEvents';
import { Engine } from '../../../engines/Engine';
import { ProjectileIntersection } from '../../../engines/types';
import { distanceBetweenTwoPoints, isSegmentIntersectingWithACircle, getCrossingPointsWithWalls, getTheClosestObject } from '../../../math';
import { RemoveProjectileEvent, ProjectileMovedEvent, Projectile, Location } from '../../../types';
import { FightingEngineEvents, SpellLandedEvent, SpellReachedTargetEvent } from '../Events';

export class GuidedProjectileEngine extends Engine {
   calculateAngles(startLocation: Location, directionLocation: Location) {
      const angle = Math.atan2(directionLocation.y - startLocation.y, directionLocation.x - startLocation.x);

      return {
         xMultiplayer: Math.cos(angle),
         yMultiplayer: Math.sin(angle),
         angle,
      };
   }

   doAction() {
      forEach(this.services.guidedProjectilesService.getAllGuidedProjectiles(), (projectile, projectileId) => {
         const allCharacters = { ...this.services.characterService.getAllCharacters(), ...this.services.monsterService.getAllCharacters() };
         const target = allCharacters[projectile.targetId];
         const directionLocation = target?.location ?? projectile.directionLocation;

         const movement = this.calculateAngles(projectile.currentLocation, directionLocation);

         const newLocation = {
            x: projectile.currentLocation.x + movement.xMultiplayer * projectile.spell.speed,
            y: projectile.currentLocation.y + movement.yMultiplayer * projectile.spell.speed,
         };

         const distanceToTarget = distanceBetweenTwoPoints(projectile.currentLocation, directionLocation);

         if (distanceToTarget <= projectile.spell.speed) {
            this.eventCrator.createEvent<RemoveProjectileEvent>({
               type: EngineEvents.RemoveProjectile,
               projectileId,
            });

            this.eventCrator.createEvent<SpellLandedEvent>({
               type: FightingEngineEvents.SpellLanded,
               spell: projectile.spell,
               caster: { ...this.services.characterService.getAllCharacters(), ...this.services.monsterService.getAllCharacters() }[projectile.casterId],
               location: directionLocation,
            });

            if (projectile.targetId) {
               this.eventCrator.createEvent<SpellReachedTargetEvent>({
                  type: FightingEngineEvents.SpellReachedTarget,
                  spell: projectile.spell,
                  caster: { ...this.services.characterService.getAllCharacters(), ...this.services.monsterService.getAllCharacters() }[projectile.casterId],
                  target,
               });
            }
         } else {
            this.eventCrator.createEvent<ProjectileMovedEvent>({
               type: EngineEvents.ProjectileMoved,
               angle: movement.angle,
               projectileId,
               newLocation,
            });
         }
      });
   }
}
