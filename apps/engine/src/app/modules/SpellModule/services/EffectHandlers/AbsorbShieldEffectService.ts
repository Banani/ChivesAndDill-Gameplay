import { AbsorbShieldEffect, SpellEffectType } from '@bananos/types';
import { EngineEvents } from 'apps/engine/src/app/EngineEvents';
import { NestedMap } from 'apps/engine/src/app/dataStructures/NestedMap';
import { map, sum } from 'lodash';
import { EventParser } from '../../../../EventParser';
import { EngineEventHandler, ScheduleActionEvent, ScheduleActionFinishedEvent } from '../../../../types';
import {
    AbsorbShieldChangedEvent,
    AbsorbShieldCreatedEvent,
    AbsorbShieldFinishedEvent,
    ApplyTargetSpellEffectEvent,
    SpellEngineEvents,
    TakeAbsorbShieldValueEvent,
} from '../../Events';

interface AbsorbEffectNavigation {
    targetId: string;
    casterId: string;
    absorbEffectId: string;
}

const SERVICE_PREFIX = 'AbsorbShield#';

export class AbsorbShieldEffectService extends EventParser {
    private absorbNestedMap: NestedMap<AbsorbEffectNavigation>;

    constructor() {
        super();
        this.absorbNestedMap = new NestedMap<AbsorbEffectNavigation>('absorbShieldEffect');

        this.eventsToHandlersMap = {
            [SpellEngineEvents.ApplyTargetSpellEffect]: this.handleApplySpellEffect,
            [SpellEngineEvents.TakeAbsorbShieldValue]: this.handleTakeAbsorbShieldValue,
            [SpellEngineEvents.AbsorbShieldCreated]: this.handleAbsorbShieldCreated,
            [EngineEvents.ScheduleActionFinished]: this.handleScheduleActionFinished
        };
    }

    handleApplySpellEffect: EngineEventHandler<ApplyTargetSpellEffectEvent> = ({ event }) => {
        if (event.effect.type === SpellEffectType.AbsorbShield) {
            const effect = event.effect as AbsorbShieldEffect;

            const navigationObject: AbsorbEffectNavigation = {
                targetId: event.target.id,
                casterId: event.caster.id,
                absorbEffectId: effect.id,
            };

            let newBuff = false;
            let absorb = this.absorbNestedMap.getElement(navigationObject);
            if (!absorb) {
                newBuff = true;
                absorb = this.absorbNestedMap.createElement(navigationObject, 0);
            }

            if (effect.stack) {
                this.absorbNestedMap.updateElement(navigationObject, Math.min(absorb.value + effect.shieldValue, effect.shieldValue * effect.stack));
            } else {
                this.absorbNestedMap.updateElement(navigationObject, effect.shieldValue);
            }

            absorb = this.absorbNestedMap.getElement(navigationObject);

            if (newBuff) {
                this.engineEventCrator.asyncCeateEvent<AbsorbShieldCreatedEvent>({
                    type: SpellEngineEvents.AbsorbShieldCreated,
                    ownerId: event.target.id,
                    absorbId: absorb.id,
                    newValue: absorb.value,
                    timeEffectType: effect.timeEffectType,
                    period: effect.period,
                    iconImage: effect.iconImage,
                    creationTime: Date.now(),
                });
            } else {
                this.engineEventCrator.asyncCeateEvent<AbsorbShieldChangedEvent>({
                    type: SpellEngineEvents.AbsorbShieldChanged,
                    absorbId: absorb.id,
                    value: absorb.value,
                });
            }
        }
    };

    handleAbsorbShieldCreated: EngineEventHandler<AbsorbShieldCreatedEvent> = ({ event }) => {
        this.engineEventCrator.asyncCeateEvent<ScheduleActionEvent>({
            type: EngineEvents.ScheduleAction,
            id: `${SERVICE_PREFIX}${event.absorbId}`,
            perdiod: event.period,
        });
    }

    handleScheduleActionFinished: EngineEventHandler<ScheduleActionFinishedEvent> = ({ event }) => {
        if (event.id.startsWith(SERVICE_PREFIX)) {
            const id = event.id.split('#')[1];
            this.absorbNestedMap.removeElementById(id);
            this.engineEventCrator.asyncCeateEvent<AbsorbShieldFinishedEvent>({
                type: SpellEngineEvents.AbsorbShieldFinished,
                absorbId: id,
            });
        }
    }

    handleTakeAbsorbShieldValue: EngineEventHandler<TakeAbsorbShieldValueEvent> = ({ event }) => {
        const absorbs = this.absorbNestedMap.getElementsByCriteriaMatchAll({ targetId: event.targetId });

        let damageToTake = event.amount;
        for (const id in absorbs) {
            if (damageToTake >= absorbs[id]) {
                this.absorbNestedMap.removeElementById(id);
                this.engineEventCrator.asyncCeateEvent<AbsorbShieldFinishedEvent>({
                    type: SpellEngineEvents.AbsorbShieldFinished,
                    absorbId: id,
                });
            } else {
                this.engineEventCrator.asyncCeateEvent<AbsorbShieldChangedEvent>({
                    type: SpellEngineEvents.AbsorbShieldChanged,
                    absorbId: id,
                    value: absorbs[id] - damageToTake,
                });
                this.absorbNestedMap.updateElementById(id, absorbs[id] - damageToTake);
                break;
            }

            damageToTake -= absorbs[id];
        }
    };

    getAbsorbShieldValue = (targetId: string): number => {
        return sum(map(this.absorbNestedMap.getElementsByCriteriaMatchAll({ targetId: targetId })));
    };
}
