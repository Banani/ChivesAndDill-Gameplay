import { forEach } from 'lodash';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import { ApplyLocationSpellEffectEvent, ApplyTargetSpellEffectEvent, EngineEventHandler } from '../../../types';
import { FightingEngineEvents, SpellLandedEvent, SpellReachedTargetEvent } from '../Events';

export class SpellEffectApplierService extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {
         [FightingEngineEvents.SpellLanded]: this.handleSpellLanded,
         [FightingEngineEvents.SpellReachedTarget]: this.handleSpellReachedTarget,
      };
   }

   handleSpellLanded: EngineEventHandler<SpellLandedEvent> = ({ event }) => {
      forEach(event.spell.spellEffectsOnDirectionLocation, (spellEffect) => {
         this.engineEventCrator.createEvent<ApplyLocationSpellEffectEvent>({
            type: EngineEvents.ApplyLocationSpellEffect,
            caster: event.caster,
            effect: spellEffect,
            location: event.location,
         });
      });

      forEach(event.spell.spellEffectsOnCasterOnSpellHit, (spellEffect) => {
         this.engineEventCrator.createEvent<ApplyTargetSpellEffectEvent>({
            type: EngineEvents.ApplyTargetSpellEffect,
            caster: event.caster,
            target: event.caster,
            effect: spellEffect,
         });
      });
   };

   handleSpellReachedTarget: EngineEventHandler<SpellReachedTargetEvent> = ({ event }) => {
      forEach(event.spell.spellEffectsOnTarget, (spellEffect) => {
         this.engineEventCrator.createEvent<ApplyTargetSpellEffectEvent>({
            type: EngineEvents.ApplyTargetSpellEffect,
            caster: event.caster,
            target: event.target,
            effect: spellEffect,
         });
      });
   };
}