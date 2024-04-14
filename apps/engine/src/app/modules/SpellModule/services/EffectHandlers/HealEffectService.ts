import { HealEffect, HealthPointsSource, SpellEffectType } from '@bananos/types';
import { EventParser } from '../../../../EventParser';
import { EngineEventHandler } from '../../../../types';
import { AddCharacterHealthPointsEvent, CharacterEngineEvents } from '../../../CharacterModule/Events';
import { ApplyTargetSpellEffectEvent, SpellEngineEvents } from '../../Events';

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

            this.engineEventCrator.asyncCeateEvent<AddCharacterHealthPointsEvent>({
                type: CharacterEngineEvents.AddCharacterHealthPoints,
                casterId: event.caster.id,
                characterId: event.target.id,
                amount: Math.ceil(effect.amount * event.effectMultiplier),
                source: HealthPointsSource.Healing,
                spellId: effect.spellId
            });
        }
    };
}
