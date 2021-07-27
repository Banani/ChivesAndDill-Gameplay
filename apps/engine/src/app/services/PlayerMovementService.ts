import { EngineEvents } from '../EngineEvents';
import { EngineEventCrator } from '../EngineEventsCreator';
import { PlayersMovement } from '../engines';
import { EventParser } from '../EventParser';
import { EngineEventHandler, PlayerStartedMovementEvent, PlayerStopedMovementVectorEvent, PlayerTriesToStartedMovementEvent } from '../types';

export class PlayerMovementService extends EventParser {
   movementEngine: PlayersMovement;

   constructor(movementEngine) {
      super();
      this.movementEngine = movementEngine;
      this.eventsToHandlersMap = {
         [EngineEvents.PlayerTriesToStartedMovement]: this.PlayerTriesToStartedMovement,
         [EngineEvents.PlayerStopedMovementVector]: this.handlePlayerStopedMovementVector,
      };
   }

   init(engineEventCrator: EngineEventCrator, services) {
      super.init(engineEventCrator);
      this.movementEngine.init(engineEventCrator, services);
   }

   PlayerTriesToStartedMovement: EngineEventHandler<PlayerTriesToStartedMovementEvent> = ({ event, services }) => {
      if (services.characterService.canMove(event.characterId)) {
         this.movementEngine.startNewMovement(event.characterId, event.movement);

         this.engineEventCrator.asyncCeateEvent<PlayerStartedMovementEvent>({
            type: EngineEvents.PlayerStartedMovement,
            characterId: event.characterId,
         });
      }
   };

   handlePlayerStopedMovementVector: EngineEventHandler<PlayerStopedMovementVectorEvent> = ({ event }) => {
      this.movementEngine.stopMovement(event.characterId, event.movement);
   };
}
