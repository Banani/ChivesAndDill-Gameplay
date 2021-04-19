import { EngineMessages, ClientMessages } from '@bananos/types';
import { EngineEvents } from '../EngineEvents';
import { EventParser } from '../EventParser';

export class PlayerMovementNotifier extends EventParser {
  constructor() {
    super();
    this.eventsToHandlersMap = {
      [EngineEvents.NewCharacterCreated]: this.NewCharacterCreated,
      [EngineEvents.PlayerMoved]: this.handlePlayerMoved,
      [EngineEvents.PlayerStopedAllMovementVectors]: this
        .handlePlayerStopedAllMovementVectors,
    };
  }

  NewCharacterCreated = ({ event, services }) => {
    const { newCharacter: currentCharacter } = event.payload;
    const currentSocket = services.socketConnectionService.getSocketById(
      currentCharacter.socketId
    );

    currentSocket.on(ClientMessages.PlayerStartMove, (movement) => {
      services.socketConnectionService
        .getIO()
        .sockets.emit(EngineMessages.PlayerStartedMovement, {
          userId: currentCharacter.id,
        });

      this.engineEventCrator.createEvent({
        type: EngineEvents.PlayerStartedMovement,
        characterId: currentCharacter.id,
        movement,
      });
    });

    currentSocket.on(ClientMessages.PlayerStopMove, (movement) => {
      this.engineEventCrator.createEvent({
        type: EngineEvents.PlayerStopedMovementVector,
        characterId: currentCharacter.id,
        movement,
      });
    });
  };

  handlePlayerMoved = ({ event, services }) => {
    services.socketConnectionService
      .getIO()
      .sockets.emit(EngineMessages.PlayerMoved, {
        playerId: event.characterId,
        newLocation: event.newLocation,
        newDirection: event.newCharacterDirection,
      });
  };

  handlePlayerStopedAllMovementVectors = ({ event, services }) => {
    services.socketConnectionService
      .getIO()
      .sockets.emit(EngineMessages.PlayerStoppedMovement, {
        userId: event.characterId,
      });
  };
}
