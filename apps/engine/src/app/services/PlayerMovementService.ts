import { EngineEvents } from '../EngineEvents';
import { EngineEventCrator } from '../EngineEventsCreator';
import { EventParser } from '../EventParser';

export class PlayerMovementService extends EventParser {
  movementEngine: any;

  constructor(movementEngine) {
    super();
    this.movementEngine = movementEngine;
    this.eventsToHandlersMap = {
      [EngineEvents.PlayerStartedMovement]: this.handlePlayerStartedMovement,
      [EngineEvents.PlayerStopedMovementVector]: this
        .handlePlayerStopedMovementVector,
    };
  }

  init(engineEventCrator: EngineEventCrator, services) {
    super.init(engineEventCrator);
    this.movementEngine.init(services);
  }

  handlePlayerStartedMovement = ({ event, services }) => {
    this.movementEngine.startNewMovement(event.characterId, event.movement);
  };

  handlePlayerStopedMovementVector = ({ event, services }) => {
    this.movementEngine.stopMovement(event.characterId, event.movement);
  };
}
