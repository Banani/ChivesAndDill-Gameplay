import { EventParser } from '../../../../EventParser';
import { EngineEventHandler } from '../../../../types';
import { CharacterEngineEvents, TakeCharacterHealthPointsEvent } from '../../../CharacterModule/Events';
import { ApplyTargetSpellEffectEvent, DamageAbsorbedEvent, SpellEngineEvents, TakeAbsorbShieldValueEvent } from '../../Events';
import { SpellEffectType, DamageEffect } from '../../types/spellTypes';

export class DamageEffectService extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {
         [SpellEngineEvents.ApplyTargetSpellEffect]: this.handleApplySpellEffect,
      };
   }

   handleApplySpellEffect: EngineEventHandler<ApplyTargetSpellEffectEvent> = ({ event, services }) => {
      if (event.effect.type === SpellEffectType.Damage) {
         const effect = event.effect as DamageEffect;

         const absorbsValue = services.absorbShieldEffectService.getAbsorbShieldValue(event.target.id);

         if (absorbsValue < effect.amount) {
            this.engineEventCrator.asyncCeateEvent<TakeCharacterHealthPointsEvent>({
               type: CharacterEngineEvents.TakeCharacterHealthPoints,
               attackerId: event.caster?.id ?? null,
               characterId: event.target.id,
               amount: effect.amount - absorbsValue,
            });
         }

         if (absorbsValue > 0) {
            this.engineEventCrator.asyncCeateEvent<TakeAbsorbShieldValueEvent>({
               type: SpellEngineEvents.TakeAbsorbShieldValue,
               targetId: event.target.id,
               amount: Math.min(absorbsValue, effect.amount),
            });

            this.engineEventCrator.asyncCeateEvent<DamageAbsorbedEvent>({
               type: SpellEngineEvents.DamageAbsorbed,
               targetId: event.target.id,
               attackerId: event.caster.id,
            });
         }
      }
   };
}
