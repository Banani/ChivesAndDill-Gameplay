import { SpellEffectType, TickOverTimeEffect } from '@bananos/types';
import { forEach } from 'lodash';
import { EventParser } from '../../../../EventParser';
import { Character, EngineEventHandler } from '../../../../types';
import { MonsterEngineEvents, MonsterLostAggroEvent } from '../../../MonsterModule/Events';
import { Monster } from '../../../MonsterModule/types';
import { ApplyTargetSpellEffectEvent, RemoveTickOverTimeEffectEvent, SpellEngineEvents, TimeEffectCreatedEvent, TimeEffectRemovedEvent } from '../../Events';
import { TickOverTimeEffectEngine } from '../../engines/TickOverTimeEffectEngine';

export interface TickEffectOverTimeTrack {
    id: string;
    creationTime: number;
    effect: TickOverTimeEffect;
    target: Character | Monster;
    caster: Character | Monster;
}

export class TickEffectOverTimeService extends EventParser {
    tickOverTimeEffectEngine: TickOverTimeEffectEngine;
    activeTickEffectOverTime: Record<string, TickEffectOverTimeTrack> = {};

    constructor(tickOverTimeEffectEngine: TickOverTimeEffectEngine) {
        super();
        this.tickOverTimeEffectEngine = tickOverTimeEffectEngine;
        this.eventsToHandlersMap = {
            [SpellEngineEvents.ApplyTargetSpellEffect]: this.handleApplySpellEffect,
            [SpellEngineEvents.RemoveTickOverTimeEffect]: this.handleTickOverTimeFinished,
            [MonsterEngineEvents.MonsterLostAggro]: this.handleMonsterLostAggro,
        };
    }

    init(engineEventCrator, services) {
        super.init(engineEventCrator);
        this.tickOverTimeEffectEngine.init(engineEventCrator, services);
    }

    handleApplySpellEffect: EngineEventHandler<ApplyTargetSpellEffectEvent> = ({ event }) => {
        if (event.effect.type === SpellEffectType.TickEffectOverTime) {
            const effect = event.effect as TickOverTimeEffect;
            const id = `${effect.spellId}_${event.target.id}`;

            this.activeTickEffectOverTime[id] = {
                id,
                creationTime: Date.now(),
                effect,
                target: event.target,
                caster: event.caster,
            };

            this.engineEventCrator.asyncCeateEvent<TimeEffectCreatedEvent>({
                type: SpellEngineEvents.TimeEffectCreated,
                timeEffect: {
                    id,
                    name: effect.name,
                    description: effect.description,
                    timeEffectType: effect.timeEffectType,
                    period: effect.period,
                    iconImage: effect.iconImage,
                    creationTime: this.activeTickEffectOverTime[id].creationTime,
                    targetId: event.target.id,
                },
            });
        }
    };

    handleTickOverTimeFinished: EngineEventHandler<RemoveTickOverTimeEffectEvent> = ({ event }) => {
        this.deleteTickOverTimeEffect(event.tickOverTimeId);
    };

    handleMonsterLostAggro: EngineEventHandler<MonsterLostAggroEvent> = ({ event }) => {
        forEach(Object.keys(this.activeTickEffectOverTime), (key) => {
            if (key.includes(`_${event.monsterId}`)) {
                this.deleteTickOverTimeEffect(key);
            }
        });
    };

    deleteTickOverTimeEffect = (effectId: string) => {
        delete this.activeTickEffectOverTime[effectId];

        this.engineEventCrator.asyncCeateEvent<TimeEffectRemovedEvent>({
            type: SpellEngineEvents.TimeEffectRemoved,
            tickOverTimeId: effectId,
        });
    };

    getActiveTickEffectOverTime = () => this.activeTickEffectOverTime;
}
