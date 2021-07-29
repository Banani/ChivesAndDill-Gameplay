import { EngineEvents } from '../../../../EngineEvents';
import { EventParser } from '../../../../EventParser';
import { EngineEventHandler, TakeCharacterHealthPointsEvent } from '../../../../types';
import { SpellEngineEvents, ApplyTargetSpellEffectEvent } from '../../Events';
import { SpellEffectType, HealEffect } from '../../types/spellTypes';

export class HealEffectService extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {
         [SpellEngineEvents.ApplyTargetSpellEffect]: this.handleApplySpellEffect,
      };
   }

   handleApplySpellEffect: EngineEventHandler<ApplyTargetSpellEffectEvent> = ({ event }) => {
      if (event.effect.type === SpellEffectType.Heal) {
         const effect = event.effect as HealEffect;

         this.engineEventCrator.asyncCeateEvent<TakeCharacterHealthPointsEvent>({
            type: EngineEvents.AddCharacterHealthPoints,
            attackerId: event.caster.id,
            characterId: event.target.id,
            amount: effect.amount,
         });
      }
   };
}
