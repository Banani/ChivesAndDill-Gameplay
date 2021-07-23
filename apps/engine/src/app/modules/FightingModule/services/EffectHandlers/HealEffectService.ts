import { EngineEvents } from '../../../../EngineEvents';
import { EventParser } from '../../../../EventParser';
import { SpellEffectType } from '../../../../SpellType';
import { ApplyTargetSpellEffectEvent, EngineEventHandler, TakeCharacterHealthPointsEvent } from '../../../../types';
import { HealEffect } from '../../../../types/Spell';

export class HealEffectService extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {
         [EngineEvents.ApplyTargetSpellEffect]: this.handleApplySpellEffect,
      };
   }

   handleApplySpellEffect: EngineEventHandler<ApplyTargetSpellEffectEvent> = ({ event }) => {
      if (event.effect.type === SpellEffectType.Heal) {
         const effect = event.effect as HealEffect;

         this.engineEventCrator.createEvent<TakeCharacterHealthPointsEvent>({
            type: EngineEvents.AddCharacterHealthPoints,
            attackerId: event.caster.id,
            characterId: event.target.id,
            amount: effect.amount,
         });
      }
   };
}
