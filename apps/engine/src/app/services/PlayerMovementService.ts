import { EngineEvents } from '../EngineEvents';
import { EngineEventCrator } from '../EngineEventsCreator';
import { EventParser } from '../EventParser';

export class PlayerMovementService extends EventParser {
   movementEngine: any;

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
      this.movementEngine.init(services);
   }

   PlayerTriesToStartedMovement = ({ event, services }) => {
      if (services.characterService.canMove(event.characterId)) {
         this.movementEngine.startNewMovement(event.characterId, event.movement);

         this.engineEventCrator.createEvent({
            type: EngineEvents.PlayerStartedMovement,
            characterId: event.characterId,
         });
      }
   };

   handlePlayerStopedMovementVector = ({ event, services }) => {
      this.movementEngine.stopMovement(event.characterId, event.movement);
   };
}
