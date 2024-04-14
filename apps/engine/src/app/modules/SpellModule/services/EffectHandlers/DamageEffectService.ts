import { DamageEffect, SpellEffectType } from '@bananos/types';
import { EventParser } from '../../../../EventParser';
import { EngineEventHandler } from '../../../../types';
import { CharacterEngineEvents, TakeCharacterHealthPointsEvent } from '../../../CharacterModule/Events';
import { ApplyTargetSpellEffectEvent, DamageAbsorbedEvent, SpellEngineEvents, TakeAbsorbShieldValueEvent } from '../../Events';

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

            const attributes = services.attributesService.getAllStats()[event.caster.id];
            if (!attributes) {
                return;
            }

            const RANDOM_RANGE = 10;
            // It takes values from 0 to 0.05
            const randomNumber = services.randomGeneratorService.generateNumber() / RANDOM_RANGE - 0.05;
            let damage = (effect.amount / 100) * attributes[effect.attribute];
            damage = Math.ceil((damage + damage * randomNumber) * event.effectMultiplier);

            const absorbsValue = services.absorbShieldEffectService.getAbsorbShieldValue(event.target.id);

            if (absorbsValue < damage) {
                this.engineEventCrator.asyncCeateEvent<TakeCharacterHealthPointsEvent>({
                    type: CharacterEngineEvents.TakeCharacterHealthPoints,
                    attackerId: event.caster?.id ?? null,
                    characterId: event.target.id,
                    amount: damage - absorbsValue,
                    spellId: event.effect.spellId
                });
            }

            if (absorbsValue > 0) {
                this.engineEventCrator.asyncCeateEvent<TakeAbsorbShieldValueEvent>({
                    type: SpellEngineEvents.TakeAbsorbShieldValue,
                    targetId: event.target.id,
                    amount: Math.min(absorbsValue, damage),
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
