import { forEach } from 'lodash';
import { EventParser } from '../../../../EventParser';
import { EngineEventHandler } from '../../../../types';
import {
   AbsorbShieldValueChangedEvent,
   ApplyTargetSpellEffectEvent,
   SpellEngineEvents,
   TakeAbsorbShieldValueEvent,
   TimeEffectCreatedEvent,
} from '../../Events';
import { SpellEffectType, AbsorbShieldEffect } from '../../types/spellTypes';

export class AbsorbShieldEffectService extends EventParser {
   // targetId => casterId => absorbId: remaining shield
   activeAbsorbShields: Record<string, Record<string, Record<string, number>>> = {};

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [SpellEngineEvents.ApplyTargetSpellEffect]: this.handleApplySpellEffect,
         [SpellEngineEvents.TakeAbsorbShieldValue]: this.handleTakeAbsorbShieldValue,
      };
   }

   handleApplySpellEffect: EngineEventHandler<ApplyTargetSpellEffectEvent> = ({ event }) => {
      if (event.effect.type === SpellEffectType.AbsorbShield) {
         const effect = event.effect as AbsorbShieldEffect;

         if (!this.activeAbsorbShields[event.target.id]) {
            this.activeAbsorbShields[event.target.id] = {};
         }
         const targetShields = this.activeAbsorbShields[event.target.id];

         if (!targetShields[event.caster.id]) {
            targetShields[event.caster.id] = { [effect.id]: 0 };
         }
         const casterShields = targetShields[event.caster.id];

         if (effect.stack) {
            casterShields[effect.id] = Math.min(casterShields[effect.id] + effect.shieldValue, effect.shieldValue * effect.stack);
         } else {
            casterShields[effect.id] = effect.shieldValue;
         }

         this.engineEventCrator.createEvent<AbsorbShieldValueChangedEvent>({
            type: SpellEngineEvents.AbsorbShieldValueChanged,
            ownerId: event.target.id,
            newValue: this.getAbsorbShieldValue(event.target.id),
         });
      }
   };

   handleTakeAbsorbShieldValue: EngineEventHandler<TakeAbsorbShieldValueEvent> = ({ event }) => {
      let amountToTake = event.amount;

      forEach(this.activeAbsorbShields[event.targetId], (casterAbsorbs) => {
         forEach(casterAbsorbs, (absorb, absorbKey) => {
            casterAbsorbs[absorbKey] = Math.max(0, absorb - amountToTake);
            amountToTake = Math.max(0, amountToTake - absorb);
         });
      });

      this.engineEventCrator.createEvent<AbsorbShieldValueChangedEvent>({
         type: SpellEngineEvents.AbsorbShieldValueChanged,
         ownerId: event.targetId,
         newValue: this.getAbsorbShieldValue(event.targetId),
      });

      this.clearEmptyShields(event.targetId);
   };

   clearEmptyShields = (targetid: string) => {
      forEach(this.activeAbsorbShields[targetid], (casterAbsorbs, casterId) => {
         forEach(casterAbsorbs, (_, absorbKey) => {
            if (!casterAbsorbs[absorbKey]) {
               delete casterAbsorbs[absorbKey];
            }
         });

         if (!Object.keys(this.activeAbsorbShields[targetid][casterId]).length) {
            delete this.activeAbsorbShields[targetid][casterId];
         }
      });

      if (!Object.keys(this.activeAbsorbShields[targetid]).length) {
         delete this.activeAbsorbShields[targetid];
      }
   };

   getAbsorbShieldValue = (targetId: string) => {
      let sum = 0;
      if (this.activeAbsorbShields[targetId]) {
         forEach(this.activeAbsorbShields[targetId], (casterAbsorbs) => {
            forEach(casterAbsorbs, (absorb) => {
               sum += absorb;
            });
         });
      }

      return sum;
   };
}
