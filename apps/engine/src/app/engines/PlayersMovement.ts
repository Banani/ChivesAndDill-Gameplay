import { CharacterDirection, Player } from '@bananos/types';
import _ from 'lodash';
import { areLinesIntersecting } from '../math/lines';
import { AREAS, BORDER } from '../../map';

export class PlayersMovement {
  services: any;
  movements = new WeakMap();

  init(services) {
    this.services = services;
  }

  startNewMovement(playerId, movement) {
    const player = this.services.characterService.getCharacterById(playerId);

    if (!this.movements.has(player)) {
      this.movements.set(player, []);
    }

    this.movements.get(player).push(movement);
  }

  stopMovement(playerId, { source }) {
    const player = this.services.characterService.getCharacterById(playerId);

    const movementList = this.movements.get(player);

    this.movements.set(
      player,
      movementList.filter((movement) => movement.source !== source)
    );

    if (!this.isPlayerInMove(playerId)) {
      this.services.eventCreatorService.createEvent({
        type: 'PlayerStopedAllMovementVectors',
        characterId: player.id,
      });
    }
  }

  isPlayerInMove(playerId) {
    const player = this.services.characterService.getCharacterById(playerId);
    return this.movements.has(player) && this.movements.get(player).length > 0;
  }

  getNewDirection(lastMovement) {
    return {
      [(lastMovement.x > 0).toString()]: CharacterDirection.RIGHT,
      [(lastMovement.x < 0).toString()]: CharacterDirection.LEFT,
      [(lastMovement.y > 0).toString()]: CharacterDirection.DOWN,
      [(lastMovement.y < 0).toString()]: CharacterDirection.UP,
    }['true'];
  }

  canMove(movementSegment) {
    return ![...BORDER, ...AREAS].find((polygon) => {
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
      this.services.characterService.getAllCharacters(),
      (player: Player) => {
        const movement = this.movements.get(player);
        if (movement && movement.length) {
          const vector = movement.reduce(
            (prev, move) => ({
              x: move.x ?? prev.x,
              y: move.y ?? prev.y,
            }),
            { x: 0, y: 0 }
          );

          const newLocation = {
            x: player.location.x + vector.x * 14,
            y: player.location.y + vector.y * 14,
          };

          const movementSegment = [
            [player.location.x, player.location.y],
            [newLocation.x, newLocation.y],
          ];
          const lastMovement = movement[movement.length - 1];

          if (this.canMove(movementSegment)) {
            this.services.eventCreatorService.createEvent({
              type: 'PlayerMoved',
              characterId: player.id,
              newCharacterDirection: this.getNewDirection(lastMovement),
              newLocation,
            });
          } else {
            this.services.eventCreatorService.createEvent({
              type: 'PlayerMoved',
              characterId: player.id,
              newCharacterDirection: this.getNewDirection(lastMovement),
              newLocation: player.location,
            });
          }
        }
      }
    );
  }
}
