import { forEach } from 'lodash';
import { Engine } from '../../../Engine';
import { distanceBetweenTwoPoints } from '../../../math';
import { Location } from '@bananos/types';
import { ProjectileMovedEvent, RemoveProjectileEvent, SpellEngineEvents, SpellLandedEvent, SpellReachedTargetEvent } from '../Events';

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
               type: SpellEngineEvents.RemoveProjectile,
               projectileId,
            });

            this.eventCrator.createEvent<SpellLandedEvent>({
               type: SpellEngineEvents.SpellLanded,
               spell: projectile.spell,
               caster: { ...this.services.characterService.getAllCharacters(), ...this.services.monsterService.getAllCharacters() }[projectile.casterId],
               location: directionLocation,
            });

            if (projectile.targetId) {
               this.eventCrator.createEvent<SpellReachedTargetEvent>({
                  type: SpellEngineEvents.SpellReachedTarget,
                  spell: projectile.spell,
                  caster: { ...this.services.characterService.getAllCharacters(), ...this.services.monsterService.getAllCharacters() }[projectile.casterId],
                  target,
               });
            }
         } else {
            this.eventCrator.createEvent<ProjectileMovedEvent>({
               type: SpellEngineEvents.ProjectileMoved,
               angle: movement.angle,
               projectileId,
               newLocation,
            });
         }
      });
   }
}
