import _ from 'lodash';
import { distanceBetweenTwoPoints } from '../math/lines';
import { EngineEvents } from '../EngineEvents';

export class ProjectileMovement {
  services: any;

  init(services) {
    this.services = services;
  }

  doAction() {
    _.each(
      this.services.projectilesService.getAllProjectiles(),
      (projectile, projectileId) => {
        const distance = Math.sqrt(
          Math.pow(
            projectile.startLocation.x - projectile.directionLocation.x,
            2
          ) +
            Math.pow(
              projectile.startLocation.y - projectile.directionLocation.y,
              2
            )
        );
        const proportion = projectile.spell.range / distance;
        const targetLocation = {
          x:
            (projectile.directionLocation.x - projectile.startLocation.x) *
            proportion,
          y:
            (projectile.directionLocation.y - projectile.startLocation.y) *
            proportion,
        };

        const angle = Math.atan2(
          targetLocation.y - projectile.startLocation.y,
          targetLocation.x - projectile.startLocation.x
        );

        const newLocation = {
          x:
            projectile.currentLocation.x +
            Math.cos(angle) * projectile.spell.speed,
          y:
            projectile.currentLocation.y +
            Math.sin(angle) * projectile.spell.speed,
        };

        if (
          distanceBetweenTwoPoints(projectile.startLocation, newLocation) >
          projectile.spell.range
        ) {
          this.services.eventCreatorService.createEvent({
            type: EngineEvents.RemoveProjectile,
            projectileId,
          });
        } else {
          this.services.eventCreatorService.createEvent({
            ...projectile,
            angle,
            type: EngineEvents.ProjectileMoved,
            projectileId,
            newLocation,
          });
        }
      }
    );
  }
}
