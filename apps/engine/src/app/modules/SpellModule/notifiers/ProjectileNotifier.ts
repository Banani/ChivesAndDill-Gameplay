import { GlobalStoreModule, ProjectileMovement } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { ProjectileCreatedEvent, ProjectileMovedEvent, ProjectileRemovedEvent, SpellEngineEvents } from '../../SpellModule/Events';

export class ProjectileNotifier extends Notifier<ProjectileMovement> {
   constructor() {
      super({ key: GlobalStoreModule.PROJECTILE_MOVEMENTS });
      this.eventsToHandlersMap = {
         [SpellEngineEvents.ProjectileCreated]: this.ProjectileCreated,
         [SpellEngineEvents.ProjectileMoved]: this.ProjectileMoved,
         [SpellEngineEvents.ProjectileRemoved]: this.ProjectileRemoved,
      };
   }

   ProjectileMoved: EngineEventHandler<ProjectileMovedEvent> = ({ event }) => {
      this.broadcastObjectsUpdate({
         objects: {
            [event.projectileId]: { location: event.newLocation, angle: event.angle },
         },
      });
   };

   ProjectileCreated: EngineEventHandler<ProjectileCreatedEvent> = ({ event }) => {
      this.broadcastObjectsUpdate({
         objects: {
            [event.projectileId]: { location: event.currentLocation, spellName: event.spell.name },
         },
      });
   };

   ProjectileRemoved: EngineEventHandler<ProjectileRemovedEvent> = ({ event }) => {
      this.broadcastObjectsDeletion({ ids: [event.projectileId] });
   };
}
