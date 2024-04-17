import { forEach } from 'lodash';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import { ApplyLocationSpellEffectEvent, ApplyTargetSpellEffectEvent, SpellEngineEvents, SpellLandedEvent, SpellReachedTargetEvent } from '../Events';

export class SpellEffectApplierService extends EventParser {
    constructor() {
        super();
        this.eventsToHandlersMap = {
            [SpellEngineEvents.SpellLanded]: this.handleSpellLanded,
            [SpellEngineEvents.SpellReachedTarget]: this.handleSpellReachedTarget,
        };
    }

    handleSpellLanded: EngineEventHandler<SpellLandedEvent> = ({ event }) => {
        if (event.spell.spellEffectsOnDirectionLocation) {
            forEach(event.spell.spellEffectsOnDirectionLocation, (spellEffect) => {
                this.engineEventCrator.asyncCeateEvent<ApplyLocationSpellEffectEvent>({
                    type: SpellEngineEvents.ApplyLocationSpellEffect,
                    caster: event.caster,
                    effect: spellEffect,
                    location: event.location,
                });
            });
        }

        if (event.spell.spellEffectsOnCasterOnSpellHit) {
            forEach(event.spell.spellEffectsOnCasterOnSpellHit, (spellEffect) => {
                this.engineEventCrator.asyncCeateEvent<ApplyTargetSpellEffectEvent>({
                    type: SpellEngineEvents.ApplyTargetSpellEffect,
                    caster: event.caster,
                    target: event.caster,
                    effect: spellEffect,
                    effectMultiplier: 1
                });
            });
        }
    };

    handleSpellReachedTarget: EngineEventHandler<SpellReachedTargetEvent> = ({ event, services }) => {
        if (!event.spell.spellEffectsOnTarget) {
            return;
        }

        if (!event.target) {
            return;
        }

        forEach(event.spell.spellEffectsOnTarget, (spellEffect) => {
            this.engineEventCrator.asyncCeateEvent<ApplyTargetSpellEffectEvent>({
                type: SpellEngineEvents.ApplyTargetSpellEffect,
                caster: event.caster,
                target: event.target,
                effect: spellEffect,
                effectMultiplier: event.effectMultiplier ?? 1
            });
        });
    };
}
