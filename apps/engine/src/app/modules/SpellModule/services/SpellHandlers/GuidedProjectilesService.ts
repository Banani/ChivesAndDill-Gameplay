import { EventParser } from 'apps/engine/src/app/EventParser';
import { distanceBetweenTwoPoints } from 'apps/engine/src/app/math';
import { EngineEventHandler } from 'apps/engine/src/app/types';
import { Location } from '@bananos/types';
import { omit } from 'lodash';
import { GuidedProjectileEngine } from '../../engines/GuidedProjectileEngine';
import {
   SubSpellCastedEvent,
   SpellEngineEvents,
   PlayerCastedSpellEvent,
   PlayerCastSpellEvent,
   PlayerCastSubSpellEvent,
   ProjectileCreatedEvent,
   ProjectileMovedEvent,
   ProjectileRemovedEvent,
   RemoveProjectileEvent,
} from '../../Events';
import { GuidedProjectileSubSpell, GuidedProjectileSpell, SpellType } from '../../types/spellTypes';

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
         [SpellEngineEvents.PlayerCastSpell]: this.handlePlayerCastSpell,
         [SpellEngineEvents.ProjectileMoved]: this.handleProjectileMoved,
         [SpellEngineEvents.RemoveProjectile]: this.handleRemoveProjectile,
         [SpellEngineEvents.PlayerCastSubSpell]: this.handlePlayerCastSubSpell,
      };
   }

   init(engineEventCrator, services) {
      super.init(engineEventCrator);
      this.guidedProjectileEngine.init(engineEventCrator, services);
   }

   handlePlayerCastSpell: EngineEventHandler<PlayerCastSpellEvent> = ({ event, services }) => {
      if (event.spell.type === SpellType.GuidedProjectile) {
         const character = services.characterService.getCharacterById(event.casterId);
         const allCharacters = services.characterService.getAllCharacters();

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
            type: SpellEngineEvents.PlayerCastedSpell,
            casterId: event.casterId,
            spell: event.spell,
         });

         this.engineEventCrator.asyncCeateEvent<ProjectileCreatedEvent>({
            type: SpellEngineEvents.ProjectileCreated,
            projectileId,
            currentLocation: character.location,
            spell: event.spell,
         });
      }
   };

   handlePlayerCastSubSpell: EngineEventHandler<PlayerCastSubSpellEvent> = ({ event, services }) => {
      if (event.spell.type === SpellType.GuidedProjectile) {
         const casterCharacter = services.characterService.getCharacterById(event.casterId);

         if (!services.characterService.getCharacterById(event.targetId)) {
            return;
         }

         this.increment++;
         const projectileId = 'guided_projectile_' + this.increment;
         this.guidedProjectilesTracks[projectileId] = {
            casterId: event.casterId,
            spell: event.spell,
            directionLocation: event.directionLocation as Location,
            targetId: event.targetId,
            startLocation: casterCharacter.location,
            currentLocation: casterCharacter.location,
         };

         this.engineEventCrator.asyncCeateEvent<SubSpellCastedEvent>({
            type: SpellEngineEvents.SubSpellCasted,
            casterId: event.casterId,
            spell: event.spell,
         });

         this.engineEventCrator.asyncCeateEvent<ProjectileCreatedEvent>({
            type: SpellEngineEvents.ProjectileCreated,
            projectileId,
            currentLocation: casterCharacter.location,
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
         delete this.guidedProjectilesTracks[event.projectileId];

         this.engineEventCrator.asyncCeateEvent<ProjectileRemovedEvent>({
            type: SpellEngineEvents.ProjectileRemoved,
            projectileId: event.projectileId,
         });
      }
   };

   getAllGuidedProjectiles = () => this.guidedProjectilesTracks;
}
