import { EventParser } from '../../../../EventParser';
import { EngineEventHandler } from '../../../../types';
import { AddCharacterSpellPowerEvent, CharacterEngineEvents } from '../../../CharacterModule/Events';
import { SpellEngineEvents, ApplyTargetSpellEffectEvent } from '../../Events';
import { SpellEffectType, GenerateSpellPowerEffect } from '../../types/spellTypes';

export class GenerateSpellPowerEffectService extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {
         [SpellEngineEvents.ApplyTargetSpellEffect]: this.handleApplySpellEffect,
      };
   }

   handleApplySpellEffect: EngineEventHandler<ApplyTargetSpellEffectEvent> = ({ event }) => {
      if (event.effect.type === SpellEffectType.GenerateSpellPower) {
         const effect = event.effect as GenerateSpellPowerEffect;

         this.engineEventCrator.asyncCeateEvent<AddCharacterSpellPowerEvent>({
            type: CharacterEngineEvents.AddCharacterSpellPower,
            characterId: event.target.id,
            amount: effect.amount,
         });
      }
   };
}
