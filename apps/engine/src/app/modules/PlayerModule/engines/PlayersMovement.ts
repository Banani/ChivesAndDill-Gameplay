import { CharacterDirection } from '@bananos/types';
import { each } from 'lodash';
import { AREAS, BORDER } from '../../';
import { Engine } from '../../../Engine';
import { EngineEvents } from '../../../EngineEvents';
import { areSegmentsIntersecting } from '../../../math';
import { PlayerMovedEvent } from '../../../types';

export class PlayersMovement extends Engine {
    movements = new WeakMap();

    startNewMovement(playerId, movement) {
        const player = this.services.characterService.getCharacterById(playerId);

        if (!this.movements.has(player)) {
            this.movements.set(player, []);
        }

        this.movements.get(player).push(movement);
    }

    stopMovement(playerId, { source }) {
        const player = this.services.characterService.getCharacterById(playerId);
        if (!player) {
            this.eventCrator.createEvent({
                type: EngineEvents.PlayerStopedAllMovementVectors,
                characterId: playerId,
            });
            return;
        }

        const movementList = this.movements.get(player);

        this.movements.set(player, movementList?.filter((movement) => movement.source !== source) ?? []);

        if (!this.isPlayerInMove(playerId)) {
            this.eventCrator.createEvent({
                type: EngineEvents.PlayerStopedAllMovementVectors,
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
                if (areSegmentsIntersecting(movementSegment, [polygon[i], polygon[(i + 1) % polygon.length]])) {
                    return true;
                }
            }
        });
    }

    doAction() {
        each(this.services.characterService.getAllCharacters(), (player) => {
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
                    x: player.location.x + vector.x * player.movementSpeed,
                    y: player.location.y + vector.y * player.movementSpeed,
                };

                const movementSegment = [
                    [player.location.x, player.location.y],
                    [newLocation.x, newLocation.y],
                ];
                const lastMovement = movement[movement.length - 1];

                if (this.canMove(movementSegment)) {
                    this.eventCrator.createEvent<PlayerMovedEvent>({
                        type: EngineEvents.PlayerMoved,
                        characterId: player.id,
                        newCharacterDirection: this.getNewDirection(lastMovement),
                        newLocation,
                    });
                } else {
                    this.eventCrator.createEvent<PlayerMovedEvent>({
                        type: EngineEvents.PlayerMoved,
                        characterId: player.id,
                        newCharacterDirection: this.getNewDirection(lastMovement),
                        newLocation: player.location,
                    });
                }
            }
        });
    }
}
