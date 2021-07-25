import { EngineEvents } from '../../../../EngineEvents';
import { EventParser } from '../../../../EventParser';
import { SpellEffectType } from '../../../../SpellType';
import { ApplyTargetSpellEffectEvent, EngineEventHandler, TakeCharacterHealthPointsEvent } from '../../../../types';
import { DamageEffect } from '../../../../types/Spell';

export class DamageEffectService extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {
         [EngineEvents.ApplyTargetSpellEffect]: this.handleApplySpellEffect,
      };
   }

   handleApplySpellEffect: EngineEventHandler<ApplyTargetSpellEffectEvent> = ({ event }) => {
      if (event.effect.type === SpellEffectType.Damage) {
         const effect = event.effect as DamageEffect;

         this.engineEventCrator.createEvent<TakeCharacterHealthPointsEvent>({
            type: EngineEvents.TakeCharacterHealthPoints,
            attackerId: event.caster.id,
            characterId: event.target.id,
            amount: effect.amount,
         });
      }
   };
}