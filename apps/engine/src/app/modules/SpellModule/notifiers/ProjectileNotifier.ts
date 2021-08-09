import { ClientMessages, ProjectileMovement } from '@bananos/types';
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
   private projectiles: Record<string, Partial<ProjectileMovement>> = {};
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
