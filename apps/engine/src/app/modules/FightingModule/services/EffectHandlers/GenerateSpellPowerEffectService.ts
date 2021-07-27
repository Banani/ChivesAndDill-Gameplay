import { EngineEvents } from '../../../../EngineEvents';
import { EventParser } from '../../../../EventParser';
import { SpellEffectType } from '../../../../SpellType';
import { AddCharacterSpellPowerEvent, ApplyTargetSpellEffectEvent, EngineEventHandler, TakeCharacterHealthPointsEvent } from '../../../../types';
import { GenerateSpellPowerEffect } from '../../../../types/Spell';

export class GenerateSpellPowerEffectService extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {
         [EngineEvents.ApplyTargetSpellEffect]: this.handleApplySpellEffect,
      };
   }

   handleApplySpellEffect: EngineEventHandler<ApplyTargetSpellEffectEvent> = ({ event }) => {
      if (event.effect.type === SpellEffectType.GenerateSpellPower) {
         const effect = event.effect as GenerateSpellPowerEffect;

         this.engineEventCrator.asyncCeateEvent<AddCharacterSpellPowerEvent>({
            type: EngineEvents.AddCharacterSpellPower,
            characterId: event.target.id,
            amount: effect.amount,
         });
      }
   };
}
