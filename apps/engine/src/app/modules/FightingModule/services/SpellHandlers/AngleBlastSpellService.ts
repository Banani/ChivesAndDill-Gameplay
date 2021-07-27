import { EngineEvents } from 'apps/engine/src/app/EngineEvents';
import { EventParser } from 'apps/engine/src/app/EventParser';
import { isSegementCrossingWithAnyWall, distanceBetweenTwoPoints } from 'apps/engine/src/app/math';
import { SpellType } from 'apps/engine/src/app/SpellType';
import {
   EngineEventHandler,
   PlayerCastSpellEvent,
   PlayerCastedSpellEvent,
   ApplyTargetSpellEffectEvent,
   PlayerCastSubSpellEvent,
} from 'apps/engine/src/app/types';
import { omit, forEach } from 'lodash';
import { Location } from '../../../../types';
import { SpellReachedTargetEvent, FightingEngineEvents, SpellLandedEvent, SubSpellCastedEvent } from '../../Events';

export class AngleBlastSpellService extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {
         [EngineEvents.PlayerCastSpell]: this.handlePlayerCastSpell,
         [EngineEvents.PlayerCastSubSpell]: this.handlePlayerCastSubSpell,
      };
   }

   isTargetInSight = (shooter: Location, target: Location) => {
      const shotSegment = [
         [shooter.x, shooter.y],
         [target.x, target.y],
      ];

      return !isSegementCrossingWithAnyWall(shotSegment);
   };

   isInRange = (caster, target, range) => distanceBetweenTwoPoints(caster.location, target.location) <= range;

   handlePlayerCastSpell: EngineEventHandler<PlayerCastSpellEvent> = ({ event, services }) => {
      if (event.spell.type === SpellType.AngleBlast) {
         const allCharacters = { ...services.characterService.getAllCharacters(), ...services.monsterService.getAllCharacters() };
         const caster = allCharacters[event.casterId];
         const castAngle = Math.atan2(-(event.directionLocation.y - caster.location.y), event.directionLocation.x - caster.location.x);

         const distanceToPI = Math.PI - Math.abs(castAngle);
         const rotatedAngle = castAngle > 0 ? -Math.PI - distanceToPI : Math.PI + distanceToPI;
         const angleDistance = event.spell.angle / 2;

         this.engineEventCrator.createEvent<PlayerCastedSpellEvent>({
            type: EngineEvents.PlayerCastedSpell,
            casterId: caster.id,
            spell: event.spell,
         });

         this.engineEventCrator.createEvent<SpellLandedEvent>({
            type: FightingEngineEvents.SpellLanded,
            spell: event.spell,
            caster,
            // BUG, do ustalenia jaka jest location
            location: event.directionLocation,
            angle: event.spell.angle,
         });

         for (const i in omit(allCharacters, [caster.id])) {
            const targetAngle = Math.atan2(-(allCharacters[i].location.y - caster.location.y), allCharacters[i].location.x - caster.location.x);
            if (
               (Math.abs(targetAngle - castAngle) <= angleDistance || Math.abs(targetAngle - rotatedAngle) <= angleDistance) &&
               this.isInRange(caster, allCharacters[i], event.spell.range) &&
               this.isTargetInSight(caster.location, allCharacters[i].location)
            ) {
               this.engineEventCrator.createEvent<SpellReachedTargetEvent>({
                  type: FightingEngineEvents.SpellReachedTarget,
                  spell: event.spell,
                  caster,
                  target: allCharacters[i],
               });
            }
         }
      }
   };

   handlePlayerCastSubSpell: EngineEventHandler<PlayerCastSubSpellEvent> = ({ event, services }) => {
      if (event.spell.type === SpellType.AngleBlast) {
         const allCharacters = { ...services.characterService.getAllCharacters(), ...services.monsterService.getAllCharacters() };
         const caster = allCharacters[event.casterId];
         const castAngle = Math.atan2(-(event.directionLocation.y - caster.location.y), event.directionLocation.x - caster.location.x);

         const distanceToPI = Math.PI - Math.abs(castAngle);
         const rotatedAngle = castAngle > 0 ? -Math.PI - distanceToPI : Math.PI + distanceToPI;
         const angleDistance = event.spell.angle / 2;

         this.engineEventCrator.createEvent<SubSpellCastedEvent>({
            type: FightingEngineEvents.SubSpellCasted,
            casterId: caster.id,
            spell: event.spell,
         });

         this.engineEventCrator.createEvent<SpellLandedEvent>({
            type: FightingEngineEvents.SpellLanded,
            spell: event.spell,
            caster,
            // BUG, do ustalenia jaka jest location
            location: event.directionLocation,
            angle: event.spell.angle,
         });

         for (const i in omit(allCharacters, [caster.id])) {
            const targetAngle = Math.atan2(-(allCharacters[i].location.y - caster.location.y), allCharacters[i].location.x - caster.location.x);
            if (
               (Math.abs(targetAngle - castAngle) <= angleDistance || Math.abs(targetAngle - rotatedAngle) <= angleDistance) &&
               this.isInRange(caster, allCharacters[i], event.spell.range) &&
               this.isTargetInSight(caster.location, allCharacters[i].location)
            ) {
               this.engineEventCrator.createEvent<SpellReachedTargetEvent>({
                  type: FightingEngineEvents.SpellReachedTarget,
                  spell: event.spell,
                  caster,
                  target: allCharacters[i],
               });
            }
         }
      }
   };
}
