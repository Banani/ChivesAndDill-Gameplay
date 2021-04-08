import _ from 'lodash';

export class PlayersMovement {
  players: any;
  movements = new WeakMap();
  onPlayerMove = (id: string) => {};

  constructor(players, onPlayerMove) {
    this.players = players;
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

  doAction() {
    _.each(this.players, (player, key) => {
      const movement = this.movements.get(player);
      if (movement && movement.length) {
        const vector = movement?.reduce(
          (prev, move) => ({
            x: move.x ?? prev.x,
            y: move.y ?? prev.y,
          }),
          { x: 0, y: 0 }
        );

        player.location = {
          x: player.location.x + vector.x,
          y: player.location.y + vector.y,
        };

        this.onPlayerMove(key);
      }
    });
  }
}
