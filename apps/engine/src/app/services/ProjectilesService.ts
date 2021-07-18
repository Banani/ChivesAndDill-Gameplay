import { EngineEvents } from '../EngineEvents';
import { ProjectileMovement } from '../engines';
import { EventParser } from '../EventParser';
import { SpellType } from '../SpellType';
import {
   Character,
   EngineEventHandler,
   PlayerCastedSpellEvent,
   PlayerTriesToCastASpellEvent,
   Projectile,
   ProjectileCreatedEvent,
   ProjectileMovedEvent,
   ProjectileRemovedEvent,
   RemoveProjectileEvent,
} from '../types';

export class ProjectilesService extends EventParser {
   projectileEngine: ProjectileMovement;
   projectiles: Record<string, Projectile> = {};
   increment = 0;

   constructor(projectileEngine) {
      super();
      this.projectileEngine = projectileEngine;
      this.eventsToHandlersMap = {
         [EngineEvents.PlayerTriesToCastASpell]: this.handlePlayerTriesToCastASpell,
         [EngineEvents.ProjectileMoved]: this.handleProjectileMoved,
         [EngineEvents.RemoveProjectile]: this.handleRemoveProjectile,
      };
   }

   init(engineEventCrator, services) {
      super.init(engineEventCrator);
      this.projectileEngine.init(engineEventCrator, services);
   }

   handlePlayerTriesToCastASpell: EngineEventHandler<PlayerTriesToCastASpellEvent> = ({ event, services }) => {
      if (event.spellData.spell.type === SpellType.PROJECTILE) {
         const character = { ...services.characterService.getAllCharacters(), ...services.monsterService.getAllCharacters() }[event.spellData.characterId];

         if ((character as Character).isDead) {
            return;
         }

         if (!services.cooldownService.isSpellAvailable(character.id, event.spellData.spell.name)) {
            return;
         }

         this.increment++;
         const projectile = {
            ...event.spellData,
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
            spell: event.spellData.spell,
         });

         this.engineEventCrator.createEvent<ProjectileCreatedEvent>({
            type: EngineEvents.ProjectileCreated,
            projectileId: this.increment.toString(),
            currentLocation: character.location,
            spell: event.spellData.spell,
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
