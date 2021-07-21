import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import { SpellEffectType } from '../../../SpellType';
import { ApplySpellEffectEvent, EngineEventHandler, TakeCharacterHealthPointsEvent } from '../../../types';
import { HealEffect } from '../../../types/Spell';

export class HealEffectService extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {
         [EngineEvents.ApplySpellEffect]: this.handleApplySpellEffect,
      };
   }

   handleApplySpellEffect: EngineEventHandler<ApplySpellEffectEvent> = ({ event }) => {
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
