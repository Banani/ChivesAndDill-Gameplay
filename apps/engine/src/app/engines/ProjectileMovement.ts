import _ from 'lodash';
import { distanceBetweenTwoPoints, areLinesIntersecting } from '../math/lines';
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
        if (
          areLinesIntersecting(movementSegment, [
            polygon[i],
            polygon[(i + 1) % polygon.length],
          ])
        ) {
          return true;
        }
      }
    });
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

        const movementSegment = [
          [projectile.currentLocation.x, projectile.currentLocation.y],
          [newLocation.x, newLocation.y],
        ];

        if (
          distanceBetweenTwoPoints(projectile.startLocation, newLocation) >
            projectile.spell.range ||
          this.isMovementCrossingWall(movementSegment)
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
