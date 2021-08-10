import { EngineEvents } from '../../../EngineEvents';
import { EngineEventCrator } from '../../../EngineEventsCreator';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler, PlayerTriesToStartedMovementEvent, PlayerStartedMovementEvent, PlayerStopedMovementVectorEvent } from '../../../types';
import { PlayersMovement } from '../engines';

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
      if (services.characterService.getCharacterById(event.characterId)) {
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
