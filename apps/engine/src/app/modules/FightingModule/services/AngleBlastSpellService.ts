import { omit, forEach } from 'lodash';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import { distanceBetweenTwoPoints, isSegementCrossingWithAnyWall } from '../../../math';
import { SpellType } from '../../../SpellType';
import { ApplyTargetSpellEffectEvent, EngineEventHandler, Location, PlayerCastedSpellEvent, PlayerCastSpellEvent } from '../../../types';

export class AngleBlastSpellService extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {
         [EngineEvents.PlayerCastSpell]: this.handlePlayerCastSpell,
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

         for (const i in omit(allCharacters, [caster.id])) {
            const targetAngle = Math.atan2(-(allCharacters[i].location.y - caster.location.y), allCharacters[i].location.x - caster.location.x);
            if (
               (Math.abs(targetAngle - castAngle) <= angleDistance || Math.abs(targetAngle - rotatedAngle) <= angleDistance) &&
               this.isInRange(caster, allCharacters[i], event.spell.range) &&
               this.isTargetInSight(caster.location, allCharacters[i].location)
            ) {
               this.engineEventCrator.createEvent<PlayerCastedSpellEvent>({
                  type: EngineEvents.PlayerCastedSpell,
                  casterId: caster.id,
                  spell: event.spell,
               });

               forEach(event.spell.spellEffectsOnTarget, (spellEffect) => {
                  this.engineEventCrator.createEvent<ApplyTargetSpellEffectEvent>({
                     type: EngineEvents.ApplyTargetSpellEffect,
                     caster: caster,
                     target: allCharacters[i],
                     effect: spellEffect,
                  });
               });
            }
         }
      }
   };
}
