import { EngineEvents } from 'apps/engine/src/app/EngineEvents';
import { EventParser } from 'apps/engine/src/app/EventParser';
import { distanceBetweenTwoPoints } from 'apps/engine/src/app/math';
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
   PlayerCastSubSpellEvent,
   GuidedProjectileSpell,
   GuidedProjectileSubSpell,
   Location,
} from 'apps/engine/src/app/types';
import { omit } from 'lodash';
import { GuidedProjectileEngine } from '../../engines/GuidedProjectileEngine';
import { SubSpellCastedEvent, FightingEngineEvents } from '../../Events';

interface GuidedProjectileTrack {
   casterId: string;
   spell: GuidedProjectileSubSpell | GuidedProjectileSpell;
   directionLocation: Location;
   targetId: string;
   startLocation: Location;
   currentLocation: Location;
}

export class GuidedProjectilesService extends EventParser {
   guidedProjectileEngine: GuidedProjectileEngine;
   guidedProjectilesTracks: Record<string, GuidedProjectileTrack> = {};
   increment = 0;

   constructor(guidedProjectileEngine: GuidedProjectileEngine) {
      super();
      this.guidedProjectileEngine = guidedProjectileEngine;
      this.eventsToHandlersMap = {
         [EngineEvents.PlayerCastSpell]: this.handlePlayerCastSpell,
         [EngineEvents.ProjectileMoved]: this.handleProjectileMoved,
         [EngineEvents.RemoveProjectile]: this.handleRemoveProjectile,
         [EngineEvents.PlayerCastSubSpell]: this.handlePlayerCastSubSpell,
      };
   }

   init(engineEventCrator, services) {
      super.init(engineEventCrator);
      this.guidedProjectileEngine.init(engineEventCrator, services);
   }

   handlePlayerCastSpell: EngineEventHandler<PlayerCastSpellEvent> = ({ event, services }) => {
      if (event.spell.type === SpellType.GuidedProjectile) {
         const allCharacters = { ...services.characterService.getAllCharacters(), ...services.monsterService.getAllCharacters() };
         const character = allCharacters[event.casterId];

         let castTargetId;

         for (const i in omit(allCharacters, [event.casterId])) {
            if (distanceBetweenTwoPoints(event.directionLocation, allCharacters[i].location) < allCharacters[i].size / 2) {
               castTargetId = allCharacters[i].id;
            }
         }

         this.increment++;
         const projectileId = 'guided_projectile_' + this.increment;
         this.guidedProjectilesTracks[projectileId] = {
            casterId: event.casterId,
            spell: event.spell,
            directionLocation: event.directionLocation as Location,
            targetId: castTargetId,
            startLocation: character.location,
            currentLocation: character.location,
         };

         this.engineEventCrator.asyncCeateEvent<PlayerCastedSpellEvent>({
            type: EngineEvents.PlayerCastedSpell,
            casterId: event.casterId,
            spell: event.spell,
         });

         this.engineEventCrator.asyncCeateEvent<ProjectileCreatedEvent>({
            type: EngineEvents.ProjectileCreated,
            projectileId,
            currentLocation: character.location,
            spell: event.spell,
         });
      }
   };

   handlePlayerCastSubSpell: EngineEventHandler<PlayerCastSubSpellEvent> = ({ event, services }) => {
      if (event.spell.type === SpellType.GuidedProjectile) {
         const character = { ...services.characterService.getAllCharacters(), ...services.monsterService.getAllCharacters() }[event.casterId];

         this.increment++;
         const projectileId = 'guided_projectile_' + this.increment;
         this.guidedProjectilesTracks[projectileId] = {
            casterId: event.casterId,
            spell: event.spell,
            directionLocation: event.directionLocation as Location,
            targetId: event.targetId,
            startLocation: character.location,
            currentLocation: character.location,
         };

         this.engineEventCrator.asyncCeateEvent<SubSpellCastedEvent>({
            type: FightingEngineEvents.SubSpellCasted,
            casterId: event.casterId,
            spell: event.spell,
         });

         this.engineEventCrator.asyncCeateEvent<ProjectileCreatedEvent>({
            type: EngineEvents.ProjectileCreated,
            projectileId,
            currentLocation: character.location,
            spell: event.spell,
         });
      }
   };

   handleProjectileMoved: EngineEventHandler<ProjectileMovedEvent> = ({ event }) => {
      if (this.guidedProjectilesTracks[event.projectileId]) {
         this.guidedProjectilesTracks[event.projectileId] = {
            ...this.guidedProjectilesTracks[event.projectileId],
            currentLocation: event.newLocation,
         };
      }
   };

   handleRemoveProjectile: EngineEventHandler<RemoveProjectileEvent> = ({ event }) => {
      if (this.guidedProjectilesTracks[event.projectileId]) {
         console.log('remove guided_projectile_' + this.increment);
         delete this.guidedProjectilesTracks[event.projectileId];

         this.engineEventCrator.asyncCeateEvent<ProjectileRemovedEvent>({
            type: EngineEvents.ProjectileRemoved,
            projectileId: event.projectileId,
         });
      }
   };

   getAllGuidedProjectiles = () => this.guidedProjectilesTracks;
}
