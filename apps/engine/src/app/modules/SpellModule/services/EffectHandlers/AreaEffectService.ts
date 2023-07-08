import { AreaEffect, Location, SpellEffectType } from '@bananos/types';
import { EventParser } from '../../../../EventParser';
import { Character, EngineEventHandler } from '../../../../types';
import { Monster } from '../../../MonsterModule/types';
import {
    ApplyLocationSpellEffectEvent,
    ApplyTargetSpellEffectEvent,
    AreaSpellEffectCreatedEvent,
    AreaSpellEffectRemovedEvent,
    RemoveAreaSpellEffectEvent,
    SpellEngineEvents,
} from '../../Events';
import { AreaEffectsEngine } from '../../engines';

export interface AreaSpellEffectTrack {
    id: string;
    creationTime: number;
    areaEffect: AreaEffect;
    location: Location;
    caster: Character | Monster;
}

export class AreaEffectService extends EventParser {
    areaEffectEngine: AreaEffectsEngine;
    activeAreaSpellEffects: Record<string, AreaSpellEffectTrack> = {};
    increment: number = 0;

    constructor(areaEffectEngine: AreaEffectsEngine) {
        super();
        this.areaEffectEngine = areaEffectEngine;
        this.eventsToHandlersMap = {
            [SpellEngineEvents.ApplyLocationSpellEffect]: this.handleApplyLocationSpellEffect,
            [SpellEngineEvents.ApplyTargetSpellEffect]: this.handleApplyTargetSpellEffect,
            [SpellEngineEvents.RemoveAreaSpellEffect]: this.handleRemoveAreaSpellEffect,
        };
    }

    init(engineEventCrator, services) {
        super.init(engineEventCrator);
        this.areaEffectEngine.init(engineEventCrator, services);
    }

    handleApplyLocationSpellEffect: EngineEventHandler<ApplyLocationSpellEffectEvent> = ({ event }) => {
        if (event.effect.type === SpellEffectType.Area) {
            this.increment++;
            this.activeAreaSpellEffects[this.increment] = {
                id: this.increment.toString(),
                creationTime: Date.now(),
                areaEffect: event.effect as AreaEffect,
                location: event.location,
                caster: event.caster,
            };

            this.engineEventCrator.asyncCeateEvent<AreaSpellEffectCreatedEvent>({
                type: SpellEngineEvents.AreaSpellEffectCreated,
                location: event.location,
                areaSpellEffectId: this.increment.toString(),
                effect: event.effect as AreaEffect,
            });
        }
    };

    handleApplyTargetSpellEffect: EngineEventHandler<ApplyTargetSpellEffectEvent> = ({ event }) => {
        if (event.effect.type === SpellEffectType.Area) {
            this.increment++;
            this.activeAreaSpellEffects[this.increment] = {
                id: this.increment.toString(),
                creationTime: Date.now(),
                areaEffect: event.effect as AreaEffect,
                location: event.target.location,
                caster: event.caster,
            };

            this.engineEventCrator.asyncCeateEvent<AreaSpellEffectCreatedEvent>({
                type: SpellEngineEvents.AreaSpellEffectCreated,
                location: event.target.location,
                areaSpellEffectId: this.increment.toString(),
                effect: event.effect as AreaEffect,
            });
        }
    };

    handleRemoveAreaSpellEffect: EngineEventHandler<RemoveAreaSpellEffectEvent> = ({ event }) => {
        delete this.activeAreaSpellEffects[event.areaId];

        this.engineEventCrator.asyncCeateEvent<AreaSpellEffectRemovedEvent>({
            type: SpellEngineEvents.AreaSpellEffectRemoved,
            areaSpellEffectId: event.areaId,
        });
    };

    getAllActiveAreaSpellEffects = () => this.activeAreaSpellEffects;
}
