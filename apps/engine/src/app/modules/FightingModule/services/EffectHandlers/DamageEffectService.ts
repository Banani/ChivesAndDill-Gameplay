import { EngineEvents } from '../../../../EngineEvents';
import { EventParser } from '../../../../EventParser';
import { SpellEffectType } from '../../../../SpellType';
import { ApplyTargetSpellEffectEvent, EngineEventHandler, TakeCharacterHealthPointsEvent } from '../../../../types';
import { DamageEffect } from '../../../../types/Spell';
import { DamageAbsorbedEvent, FightingEngineEvents, TakeAbsorbShieldValueEvent } from '../../Events';

export class DamageEffectService extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {
         [EngineEvents.ApplyTargetSpellEffect]: this.handleApplySpellEffect,
      };
   }

   handleApplySpellEffect: EngineEventHandler<ApplyTargetSpellEffectEvent> = ({ event, services }) => {
      if (event.effect.type === SpellEffectType.Damage) {
         const effect = event.effect as DamageEffect;

         const absorbsValue = services.absorbShieldEffectService.getAbsorbShieldValue(event.target.id);

         if (absorbsValue < effect.amount) {
            this.engineEventCrator.asyncCeateEvent<TakeCharacterHealthPointsEvent>({
               type: EngineEvents.TakeCharacterHealthPoints,
               attackerId: event.caster?.id ?? null,
               characterId: event.target.id,
               amount: effect.amount - absorbsValue,
            });
         }

         if (absorbsValue > 0) {
            this.engineEventCrator.asyncCeateEvent<TakeAbsorbShieldValueEvent>({
               type: FightingEngineEvents.TakeAbsorbShieldValue,
               targetId: event.target.id,
               amount: Math.min(absorbsValue, effect.amount),
            });

            this.engineEventCrator.asyncCeateEvent<DamageAbsorbedEvent>({
               type: FightingEngineEvents.DamageAbsorbed,
               targetId: event.target.id,
               attackerId: event.caster.id,
            });
         }
      }
   };
}
