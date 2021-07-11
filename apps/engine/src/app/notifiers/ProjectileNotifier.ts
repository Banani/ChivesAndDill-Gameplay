import { EngineMessages, ClientMessages } from '@bananos/types';
import { EngineEvents } from '../EngineEvents';
import { EventParser } from '../EventParser';
import { ALL_SPELLS } from '../spells';
import {
   EngineEventHandler,
   NewCharacterCreatedEvent,
   PlayerTriesToCastASpellEvent,
   ProjectileCreatedEvent,
   ProjectileMovedEvent,
   ProjectileRemovedEvent,
} from '../types';

export class ProjectileNotifier extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {
         [EngineEvents.NewCharacterCreated]: this.NewCharacterCreated,
         [EngineEvents.ProjectileCreated]: this.ProjectileCreated,
         [EngineEvents.ProjectileMoved]: this.ProjectileMoved,
         [EngineEvents.ProjectileRemoved]: this.ProjectileRemoved,
      };
   }

   ProjectileMoved: EngineEventHandler<ProjectileMovedEvent> = ({ event, services }) => {
      services.socketConnectionService.getIO().sockets.emit(EngineMessages.ProjectileMoved, {
         projectileId: event.projectileId,
         newLocation: event.newLocation,
         angle: event.angle,
      });
   };

   ProjectileCreated: EngineEventHandler<ProjectileCreatedEvent> = ({ event, services }) => {
      services.socketConnectionService.getIO().sockets.emit(EngineMessages.ProjectileCreated, {
         projectileId: event.projectileId,
         currentLocation: event.currentLocation,
         spell: event.spell.name,
      });
   };

   ProjectileRemoved: EngineEventHandler<ProjectileRemovedEvent> = ({ event, services }) => {
      services.socketConnectionService.getIO().sockets.emit(EngineMessages.ProjectileRemoved, {
         projectileId: event.projectileId,
      });
   };

   NewCharacterCreated: EngineEventHandler<NewCharacterCreatedEvent> = ({ event, services }) => {
      const { newCharacter: currentCharacter } = event.payload;
      const currentSocket = services.socketConnectionService.getSocketById(currentCharacter.socketId);

      currentSocket.on(ClientMessages.PerformBasicAttack, ({ directionLocation, spellName }) => {
         this.engineEventCrator.createEvent<PlayerTriesToCastASpellEvent>({
            type: EngineEvents.PlayerTriesToCastASpell,
            spellData: {
               characterId: currentCharacter.id,
               spell: ALL_SPELLS[spellName],
               directionLocation,
            },
         });
      });
   };
}
