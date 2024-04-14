import { forEach } from 'lodash';
import { Engine } from '../../../Engine';
import { distanceBetweenTwoPoints } from '../../../math';
import { ApplyTargetSpellEffectEvent, RemoveAreaSpellEffectEvent, SpellEngineEvents } from '../Events';
import { AreaSpellEffectTrack } from '../services/EffectHandlers/AreaEffectService';

export class AreaEffectsEngine extends Engine {
    attackTime: Record<string, number> = {};

    isNotReadyForHit = (areaSpellEffectTrack: AreaSpellEffectTrack) =>
        this.attackTime[areaSpellEffectTrack.id] && this.attackTime[areaSpellEffectTrack.id] + areaSpellEffectTrack.areaEffect.activationFrequency > Date.now();

    doAction() {
        forEach(this.services.areaEffectService.getAllActiveAreaSpellEffects(), (areaSpellEffectTrack) => {
            const allCharacters = { ...this.services.characterService.getAllCharacters(), ...this.services.monsterService.getAllCharacters() };

            if (this.isNotReadyForHit(areaSpellEffectTrack)) {
                return;
            }
            this.attackTime[areaSpellEffectTrack.id] = Date.now();

            forEach(allCharacters, (character) => {
                if (distanceBetweenTwoPoints(character.location, areaSpellEffectTrack.location) < areaSpellEffectTrack.areaEffect.radius) {
                    forEach(areaSpellEffectTrack.areaEffect.spellEffects, (effect) => {
                        this.eventCrator.createEvent<ApplyTargetSpellEffectEvent>({
                            type: SpellEngineEvents.ApplyTargetSpellEffect,
                            caster: areaSpellEffectTrack.caster,
                            target: character,
                            effect,
                            effectMultiplier: 1
                        });
                    });
                }
            });

            if (areaSpellEffectTrack.creationTime + areaSpellEffectTrack.areaEffect.period <= Date.now()) {
                delete this.attackTime[areaSpellEffectTrack.id];
                this.eventCrator.createEvent<RemoveAreaSpellEffectEvent>({
                    type: SpellEngineEvents.RemoveAreaSpellEffect,
                    areaId: areaSpellEffectTrack.id,
                });
            }
        });
    }
}
