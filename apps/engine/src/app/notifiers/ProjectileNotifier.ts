import { EngineMessages, ClientMessages } from '@bananos/types';
import { EngineEvents } from '../EngineEvents';
import { EventParser } from '../EventParser';

export class ProjectileNotifier extends EventParser {
  constructor() {
    super();
    this.eventsToHandlersMap = {
      [EngineEvents.NewCharacterCreated]: this.NewCharacterCreated,
      [EngineEvents.ProjectileCreated]: this.ProjectileCreated,
      [EngineEvents.ProjectileMoved]: this.ProjectileMoved,
    };
  }

  ProjectileMoved = ({ event, services }) => {
    services.socketConnectionService
      .getIO()
      .sockets.emit(EngineMessages.ProjectileMoved, {
        projectileId: event.projectileId,
        newLocation: event.newLocation,
        angle: event.angle,
      });
  };

  ProjectileCreated = ({ event, services }) => {
    services.socketConnectionService
      .getIO()
      .sockets.emit(EngineMessages.ProjectileCreated, {
        projectileId: event.projectileId,
        spell: event.spell,
      });
  };

  NewCharacterCreated = ({ event, services }) => {
    const { newCharacter: currentCharacter } = event.payload;
    const currentSocket = services.socketConnectionService.getSocketById(
      currentCharacter.socketId
    );

    currentSocket.on(
      ClientMessages.PerformBasicAttack,
      ({ directionLocation, spellName }) => {
        this.engineEventCrator.createEvent({
          type: EngineEvents.PlayerCastedSpell,
          spellData: {
            characterId: currentCharacter.id,
            spell: {
              name: spellName,
              range: 400,
              speed: 4,
            },
            directionLocation,
          },
        });
      }
    );
  };
}
