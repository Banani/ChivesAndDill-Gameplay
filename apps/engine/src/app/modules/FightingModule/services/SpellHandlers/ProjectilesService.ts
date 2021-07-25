import { EngineEvents } from 'apps/engine/src/app/EngineEvents';
import { EventParser } from 'apps/engine/src/app/EventParser';
import { SpellType } from 'apps/engine/src/app/SpellType';
import {
   Projectile,
   EngineEventHandler,
   PlayerCastSpellEvent,
   PlayerCastedSpellEvent,
   ProjectileCreatedEvent,
   ProjectileMovedEvent,
   RemoveProjectileEvent,
   ProjectileRemovedEvent,
} from 'apps/engine/src/app/types';
import { ProjectileMovement } from '../..';

export class ProjectilesService extends EventParser {
   projectileEngine: ProjectileMovement;
   projectiles: Record<string, Projectile> = {};
   increment = 0;

   constructor(projectileEngine) {
      super();
      this.projectileEngine = projectileEngine;
      this.eventsToHandlersMap = {
         [EngineEvents.PlayerCastSpell]: this.handlePlayerCastSpell,
         [EngineEvents.ProjectileMoved]: this.handleProjectileMoved,
         [EngineEvents.RemoveProjectile]: this.handleRemoveProjectile,
      };
   }

   init(engineEventCrator, services) {
      super.init(engineEventCrator);
      this.projectileEngine.init(engineEventCrator, services);
   }

   handlePlayerCastSpell: EngineEventHandler<PlayerCastSpellEvent> = ({ event, services }) => {
      if (event.spell.type === SpellType.Projectile) {
         const character = { ...services.characterService.getAllCharacters(), ...services.monsterService.getAllCharacters() }[event.casterId];

         this.increment++;
         const projectile = {
            characterId: event.casterId,
            spell: event.spell,
            directionLocation: event.directionLocation,
            startLocation: character.location,
            currentLocation: character.location,
         };

         this.projectiles[this.increment] = {
            ...projectile,
            ...this.projectileEngine.calculateAngles(projectile),
         };

         this.engineEventCrator.createEvent<PlayerCastedSpellEvent>({
            type: EngineEvents.PlayerCastedSpell,
            casterId: character.id,
            spell: event.spell,
         });

         this.engineEventCrator.createEvent<ProjectileCreatedEvent>({
            type: EngineEvents.ProjectileCreated,
            projectileId: this.increment.toString(),
            currentLocation: character.location,
            spell: event.spell,
         });
      }
   };

   handleProjectileMoved: EngineEventHandler<ProjectileMovedEvent> = ({ event }) => {
      this.projectiles[event.projectileId] = {
         ...this.projectiles[event.projectileId],
         currentLocation: event.newLocation,
      };
   };

   handleRemoveProjectile: EngineEventHandler<RemoveProjectileEvent> = ({ event }) => {
      delete this.projectiles[event.projectileId];

      this.engineEventCrator.createEvent<ProjectileRemovedEvent>({
         type: EngineEvents.ProjectileRemoved,
         projectileId: event.projectileId,
      });
   };

   getAllProjectiles = () => this.projectiles;
}