import { EngineMessages, ClientMessages } from '@bananos/types';
import { EngineEvents } from '../EngineEvents';
import { EventParser } from '../EventParser';
import {
   EngineEventHandler,
   NewCharacterCreatedEvent,
   PlayerMovedEvent,
   PlayerStartedMovementEvent,
   PlayerStopedAllMovementVectorsEvent,
   PlayerStopedMovementVectorEvent,
   PlayerTriesToStartedMovementEvent,
} from '../types';

export class PlayerMovementNotifier extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {
         [EngineEvents.NewCharacterCreated]: this.NewCharacterCreated,
         [EngineEvents.PlayerMoved]: this.handlePlayerMoved,
         [EngineEvents.PlayerStopedAllMovementVectors]: this.handlePlayerStopedAllMovementVectors,
         [EngineEvents.PlayerStartedMovement]: this.handlePlayerStartedMovement,
      };
   }

   handlePlayerStartedMovement: EngineEventHandler<PlayerStartedMovementEvent> = ({ event, services }) => {
      services.socketConnectionService.getIO().sockets.emit(EngineMessages.PlayerStartedMovement, {
         userId: event.characterId,
      });
   };

   NewCharacterCreated: EngineEventHandler<NewCharacterCreatedEvent> = ({ event, services }) => {
      const { newCharacter: currentCharacter } = event.payload;
      const currentSocket = services.socketConnectionService.getSocketById(currentCharacter.socketId);

      currentSocket.on(ClientMessages.PlayerStartMove, (movement) => {
         this.engineEventCrator.createEvent<PlayerTriesToStartedMovementEvent>({
            type: EngineEvents.PlayerTriesToStartedMovement,
            characterId: currentCharacter.id,
            movement,
         });
      });

      currentSocket.on(ClientMessages.PlayerStopMove, (movement) => {
         this.engineEventCrator.createEvent<PlayerStopedMovementVectorEvent>({
            type: EngineEvents.PlayerStopedMovementVector,
            characterId: currentCharacter.id,
            movement,
         });
      });
   };

   handlePlayerMoved: EngineEventHandler<PlayerMovedEvent> = ({ event, services }) => {
      services.socketConnectionService.getIO().sockets.emit(EngineMessages.PlayerMoved, {
         playerId: event.characterId,
         newLocation: event.newLocation,
         newDirection: event.newCharacterDirection,
      });
   };

   handlePlayerStopedAllMovementVectors: EngineEventHandler<PlayerStopedAllMovementVectorsEvent> = ({ event, services }) => {
      services.socketConnectionService.getIO().sockets.emit(EngineMessages.PlayerStoppedMovement, {
         userId: event.characterId,
      });
   };
}
