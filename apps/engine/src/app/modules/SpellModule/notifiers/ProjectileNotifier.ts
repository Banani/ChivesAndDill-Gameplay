import { EngineMessages, ClientMessages } from '@bananos/types';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler, NewPlayerCreatedEvent } from '../../../types';
import {
   PlayerTriesToCastASpellEvent,
   ProjectileCreatedEvent,
   ProjectileMovedEvent,
   ProjectileRemovedEvent,
   SpellEngineEvents,
} from '../../SpellModule/Events';

export class ProjectileNotifier extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {
         [EngineEvents.NewPlayerCreated]: this.handleNewPlayerCreated,
         [SpellEngineEvents.ProjectileCreated]: this.ProjectileCreated,
         [SpellEngineEvents.ProjectileMoved]: this.ProjectileMoved,
         [SpellEngineEvents.ProjectileRemoved]: this.ProjectileRemoved,
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

   handleNewPlayerCreated: EngineEventHandler<NewPlayerCreatedEvent> = ({ event, services }) => {
      const { newCharacter: currentCharacter } = event.payload;
      const currentSocket = services.socketConnectionService.getSocketById(currentCharacter.socketId);

      currentSocket.on(ClientMessages.PerformBasicAttack, ({ directionLocation, spellName }) => {
         this.engineEventCrator.asyncCeateEvent<PlayerTriesToCastASpellEvent>({
            type: SpellEngineEvents.PlayerTriesToCastASpell,
            spellData: {
               characterId: currentCharacter.id,
               spellName,
               directionLocation,
            },
         });
      });
   };
}
