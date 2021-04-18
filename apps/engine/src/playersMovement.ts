import { CharacterDirection } from '@bananos/types';
import _ from 'lodash';
import { areLinesIntersecting } from './mathUtils';

export class PlayersMovement {
  areas: any;
  players: any;
  movements = new WeakMap();
  onPlayerMove = (id: string) => { };

  constructor(players, areas, onPlayerMove) {
    this.players = players;
    this.areas = areas;
    this.onPlayerMove = onPlayerMove;
  }

  startNewMovement(playerId, movement) {
    const player = this.players[playerId];

    if (!this.movements.has(player)) {
      this.movements.set(player, []);
    }

    this.movements.get(player).push(movement);
  }

  stopMovement(playerId, { source }) {
    const player = this.players[playerId];

    const movementList = this.movements.get(player);

    this.movements.set(
      player,
      movementList.filter((movement) => movement.source !== source)
    );
  }

  isPlayerInMove(playerId) {
    return (
      this.movements.has(this.players[playerId]) &&
      this.movements.get(this.players[playerId]).length > 0
    );
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
    return !this.areas.find((polygon) => {
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
    _.each(this.players, (player: Player, key) => {
      const movement = this.movements.get(player);
      if (movement && movement.length) {
        const vector = movement.reduce(
          (prev, move) => ({
            x: move.x ?? prev.x,
            y: move.y ?? prev.y,
          }),
          { x: 0, y: 0 }
        );

        const newPosition = {
          x: player.location.x + vector.x * 14,
          y: player.location.y + vector.y * 14,
        };

        const movementSegment = [
          [player.location.x, player.location.y],
          [newPosition.x, newPosition.y],
        ];

        if (this.canMove(movementSegment)) {
          player.location = newPosition;

          const lastMovement = movement[movement.length - 1];
          player.direction = this.getNewDirection(lastMovement);

          this.onPlayerMove(key);
        }
      }
    });
  }
}
