import { ProjectileMovement } from '@bananos/types';
import { EventParser } from '../../../EventParser';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { ProjectileCreatedEvent, ProjectileMovedEvent, ProjectileRemovedEvent, SpellEngineEvents } from '../../SpellModule/Events';

export class ProjectileNotifier extends EventParser implements Notifier {
   private projectiles: Record<string, Partial<ProjectileMovement>> = {};
   private toDelete: string[] = [];

   constructor() {
      super();
      this.eventsToHandlersMap = {
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
         location: event.newLocation,
         angle: event.angle,
      };
   };

   ProjectileCreated: EngineEventHandler<ProjectileCreatedEvent> = ({ event, services }) => {
      this.projectiles[event.projectileId] = {
         ...this.projectiles[event.projectileId],
         location: event.currentLocation,
         spellName: event.spell.name,
      };
   };

   ProjectileRemoved: EngineEventHandler<ProjectileRemovedEvent> = ({ event, services }) => {
      this.toDelete.push(event.projectileId);
   };
}
