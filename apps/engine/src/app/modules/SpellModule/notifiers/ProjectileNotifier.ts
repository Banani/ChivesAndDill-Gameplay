import { EngineMessages, ClientMessages, Projectile } from '@bananos/types';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler, NewPlayerCreatedEvent } from '../../../types';
import {
   PlayerTriesToCastASpellEvent,
   ProjectileCreatedEvent,
   ProjectileMovedEvent,
   ProjectileRemovedEvent,
   SpellEngineEvents,
} from '../../SpellModule/Events';

export class ProjectileNotifier extends EventParser implements Notifier {
   private projectiles: Record<string, Partial<Projectile>> = {};
   private toDelete: string[] = [];

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [EngineEvents.NewPlayerCreated]: this.handleNewPlayerCreated,
         [SpellEngineEvents.ProjectileCreated]: this.ProjectileCreated,
         [SpellEngineEvents.ProjectileMoved]: this.ProjectileMoved,
         [SpellEngineEvents.ProjectileRemoved]: this.ProjectileRemoved,
      };
   }

   getBroadcast = () => {
      const projectileInformations = this.projectiles;
      const toDelete = [...this.toDelete];

      this.projectiles = {};
      this.toDelete = [];

      return { data: projectileInformations, key: 'projectileMovements', toDelete };
   };

   ProjectileMoved: EngineEventHandler<ProjectileMovedEvent> = ({ event, services }) => {
      this.projectiles[event.projectileId] = {
         ...this.projectiles[event.projectileId],
         currentLocation: event.newLocation,
         angle: event.angle,
      };

      services.socketConnectionService.getIO().sockets.emit(EngineMessages.ProjectileMoved, {
         projectileId: event.projectileId,
         newLocation: event.newLocation,
         angle: event.angle,
      });
   };

   ProjectileCreated: EngineEventHandler<ProjectileCreatedEvent> = ({ event, services }) => {
      this.projectiles[event.projectileId] = {
         ...this.projectiles[event.projectileId],
         currentLocation: event.currentLocation,
         spell: event.spell.name,
      };

      services.socketConnectionService.getIO().sockets.emit(EngineMessages.ProjectileCreated, {
         projectileId: event.projectileId,
         currentLocation: event.currentLocation,
         spell: event.spell.name,
      });
   };

   ProjectileRemoved: EngineEventHandler<ProjectileRemovedEvent> = ({ event, services }) => {
      this.toDelete.push(event.projectileId);
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
