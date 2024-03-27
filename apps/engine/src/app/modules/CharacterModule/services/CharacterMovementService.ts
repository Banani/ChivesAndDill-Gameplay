import { CharacterClientActions, PlayerStartMove, PlayerStopMove } from '@bananos/types';
import { EngineEvents } from '../../../EngineEvents';
import { EngineEventCrator } from '../../../EngineEventsCreator';
import { EventParser } from '../../../EventParser';
import { EngineActionHandler, PlayerStartedMovementEvent } from '../../../types';
import { PlayersMovement } from '../engines';

export class CharacterMovementService extends EventParser {
    movementEngine: PlayersMovement;

    constructor(movementEngine) {
        super();
        this.movementEngine = movementEngine;
        this.eventsToHandlersMap = {
            [CharacterClientActions.PlayerStartMove]: this.handlePlayerStartMove,
            [CharacterClientActions.PlayerStopMove]: this.handlePlayerStopMove,
        };
    }

    init(engineEventCrator: EngineEventCrator, services) {
        super.init(engineEventCrator);
        this.movementEngine.init(engineEventCrator, services);
    }

    handlePlayerStartMove: EngineActionHandler<PlayerStartMove> = ({ event, services }) => {
        if (services.characterService.getCharacterById(event.requestingCharacterId)) {
            this.movementEngine.startNewMovement(event.requestingCharacterId, event.movement);

            this.engineEventCrator.asyncCeateEvent<PlayerStartedMovementEvent>({
                type: EngineEvents.PlayerStartedMovement,
                characterId: event.requestingCharacterId,
            });
        }
    };

    handlePlayerStopMove: EngineActionHandler<PlayerStopMove> = ({ event }) => {
        this.movementEngine.stopMovement(event.requestingCharacterId, event.source);
    };
}
