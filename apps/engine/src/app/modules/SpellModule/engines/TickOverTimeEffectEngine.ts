import { forEach } from 'lodash';
import { Engine } from '../../../Engine';
import { ApplyTargetSpellEffectEvent, RemoveTickOverTimeEffectEvent, SpellEngineEvents } from '../Events';
import { TickEffectOverTimeTrack } from '../services/EffectHandlers/TickEffectOverTimeService';

export class TickOverTimeEffectEngine extends Engine {
    tickTime: Record<string, number> = {};

    isNotReadyForHit = (channelSpellsTrack: TickEffectOverTimeTrack) => {
        if (!this.tickTime[channelSpellsTrack.id]) {
            this.tickTime[channelSpellsTrack.id] = Date.now();
        }
        return this.tickTime[channelSpellsTrack.id] && this.tickTime[channelSpellsTrack.id] + channelSpellsTrack.effect.activationFrequency > Date.now();
    };

    doAction() {
        forEach(this.services.tickEffectOverTimeService.getActiveTickEffectOverTime(), (tickOverTime) => {
            if (this.isNotReadyForHit(tickOverTime)) {
                return;
            }
            this.tickTime[tickOverTime.id] = Date.now();

            forEach(tickOverTime.effect.spellEffects, (effect) => {
                this.eventCrator.createEvent<ApplyTargetSpellEffectEvent>({
                    type: SpellEngineEvents.ApplyTargetSpellEffect,
                    caster: tickOverTime.caster,
                    target: tickOverTime.target,
                    effect,
                    effectMultiplier: 1,
                });
            });

            if (tickOverTime.creationTime + tickOverTime.effect.period <= Date.now()) {
                delete this.tickTime[tickOverTime.id];
                this.eventCrator.createEvent<RemoveTickOverTimeEffectEvent>({
                    type: SpellEngineEvents.RemoveTickOverTimeEffect,
                    tickOverTimeId: tickOverTime.id,
                });
            }
        });
    }
}
