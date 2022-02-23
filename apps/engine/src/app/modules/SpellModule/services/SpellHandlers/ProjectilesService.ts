import { EventParser } from 'apps/engine/src/app/EventParser';
import { EngineEventHandler } from 'apps/engine/src/app/types';
import { ProjectileMovement } from '../../engines';
import {
   SubSpellCastedEvent,
   SpellEngineEvents,
   PlayerCastedSpellEvent,
   PlayerCastSpellEvent,
   PlayerCastSubSpellEvent,
   Projectile,
   ProjectileCreatedEvent,
   ProjectileMovedEvent,
   ProjectileRemovedEvent,
   RemoveProjectileEvent,
} from '../../Events';
import { SpellType } from '../../types/spellTypes';

export class ProjectilesService extends EventParser {
   projectileEngine: ProjectileMovement;
   projectiles: Record<string, Projectile> = {};
   increment = 0;

   constructor(projectileEngine) {
      super();
      this.projectileEngine = projectileEngine;
      this.eventsToHandlersMap = {
         [SpellEngineEvents.PlayerCastSpell]: this.handlePlayerCastSpell,
         [SpellEngineEvents.ProjectileMoved]: this.handleProjectileMoved,
         [SpellEngineEvents.RemoveProjectile]: this.handleRemoveProjectile,
         [SpellEngineEvents.PlayerCastSubSpell]: this.handlePlayerCastSubSpell,
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

         this.engineEventCrator.asyncCeateEvent<PlayerCastedSpellEvent>({
            type: SpellEngineEvents.PlayerCastedSpell,
            casterId: character.id,
            spell: event.spell,
         });

         this.engineEventCrator.asyncCeateEvent<ProjectileCreatedEvent>({
            type: SpellEngineEvents.ProjectileCreated,
            projectileId: this.increment.toString(),
            currentLocation: character.location,
            spell: event.spell,
         });
      }
   };

   handlePlayerCastSubSpell: EngineEventHandler<PlayerCastSubSpellEvent> = ({ event, services }) => {
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

         this.engineEventCrator.asyncCeateEvent<SubSpellCastedEvent>({
            type: SpellEngineEvents.SubSpellCasted,
            casterId: event.casterId,
            spell: event.spell,
         });

         this.engineEventCrator.asyncCeateEvent<ProjectileCreatedEvent>({
            type: SpellEngineEvents.ProjectileCreated,
            projectileId: this.increment.toString(),
            currentLocation: character.location,
            spell: event.spell,
         });
      }
   };

   handleProjectileMoved: EngineEventHandler<ProjectileMovedEvent> = ({ event }) => {
      if (this.projectiles[event.projectileId]) {
         this.projectiles[event.projectileId] = {
            ...this.projectiles[event.projectileId],
            currentLocation: event.newLocation,
         };
      }
   };

   handleRemoveProjectile: EngineEventHandler<RemoveProjectileEvent> = ({ event }) => {
      if (this.projectiles[event.projectileId]) {
         delete this.projectiles[event.projectileId];

         this.engineEventCrator.asyncCeateEvent<ProjectileRemovedEvent>({
            type: SpellEngineEvents.ProjectileRemoved,
            projectileId: event.projectileId,
         });
      }
   };

   getAllProjectiles = () => this.projectiles;
}
