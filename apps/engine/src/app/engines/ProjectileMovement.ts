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

  calculateAngles(projectile) {
    const distance = Math.sqrt(
      Math.pow(projectile.startLocation.x - projectile.directionLocation.x, 2) +
        Math.pow(projectile.startLocation.y - projectile.directionLocation.y, 2)
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

    return {
      xMultiplayer: Math.cos(angle),
      yMultiplayer: Math.sin(angle),
      angle,
    };
  }

  doAction() {
    _.each(
      this.services.projectilesService.getAllProjectiles(),
      (projectile, projectileId) => {
        const newLocation = {
          x:
            projectile.currentLocation.x +
            projectile.xMultiplayer * projectile.spell.speed,
          y:
            projectile.currentLocation.y +
            projectile.yMultiplayer * projectile.spell.speed,
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
            type: EngineEvents.ProjectileMoved,
            projectileId,
            newLocation,
          });
        }
      }
    );
  }
}
