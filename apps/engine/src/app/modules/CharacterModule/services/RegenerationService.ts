import { HealthPointsSource } from '@bananos/types';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import {
    CancelScheduledActionEvent,
    Character,
    CharacterDiedEvent,
    EngineEventHandler,
    ScheduleActionEvent,
    ScheduleActionTriggeredEvent,
} from '../../../types';
import { AddCharacterHealthPointsEvent, AddCharacterSpellPowerEvent, CharacterEngineEvents, CharacterRemovedEvent, NewCharacterCreatedEvent } from '../Events';

const SERVICE_PREFIX = 'Regeneration_';

interface Regeneration {
    targetId: string;
    spellPowerRegeneration: number;
    healthPointsRegeneration: number;
}

export class RegenerationService extends EventParser {
    private activeRegenerations: Record<string, Regeneration> = {};

    constructor() {
        super();
        this.eventsToHandlersMap = {
            [CharacterEngineEvents.NewCharacterCreated]: this.handleNewCharacterCreated,
            [EngineEvents.CharacterDied]: this.handleCharacterDied,
            [EngineEvents.ScheduleActionTriggered]: this.handleScheduleActionTriggered,
            [CharacterEngineEvents.CharacterRemoved]: this.handleCharacterRemoved,
        };
    }

    handleNewCharacterCreated: EngineEventHandler<NewCharacterCreatedEvent> = ({ event }) => {
        this.scheduleRegenerations(event.character);
    };

    scheduleRegenerations = (character: Character) => {
        this.activeRegenerations[`${SERVICE_PREFIX}${character.id}`] = {
            targetId: character.id,
            spellPowerRegeneration: character.spellPowerRegeneration,
            healthPointsRegeneration: character.healthPointsRegeneration,
        };

        this.engineEventCrator.asyncCeateEvent<ScheduleActionEvent>({
            type: EngineEvents.ScheduleAction,
            id: `${SERVICE_PREFIX}${character.id}`,
            frequency: 1000,
        });
    };

    handleScheduleActionTriggered: EngineEventHandler<ScheduleActionTriggeredEvent> = ({ event }) => {
        const regeneration = this.activeRegenerations[event.id];

        this.engineEventCrator.asyncCeateEvent<AddCharacterHealthPointsEvent>({
            type: CharacterEngineEvents.AddCharacterHealthPoints,
            characterId: regeneration.targetId,
            amount: regeneration.healthPointsRegeneration,
            source: HealthPointsSource.Regeneration,
            casterId: null,
            spellId: null
        });

        this.engineEventCrator.asyncCeateEvent<AddCharacterSpellPowerEvent>({
            type: CharacterEngineEvents.AddCharacterSpellPower,
            characterId: regeneration.targetId,
            amount: regeneration.spellPowerRegeneration,
        });
    };

    cleanAfterCharacter = (id: string) => {
        delete this.activeRegenerations[id];

        this.engineEventCrator.asyncCeateEvent<CancelScheduledActionEvent>({
            type: EngineEvents.CancelScheduledAction,
            id: `${SERVICE_PREFIX}${id}`,
        });
    };

    handleCharacterDied: EngineEventHandler<CharacterDiedEvent> = ({ event }) => {
        this.cleanAfterCharacter(event.characterId);
    };

    handleCharacterRemoved: EngineEventHandler<CharacterRemovedEvent> = ({ event }) => {
        this.cleanAfterCharacter(event.character.id);
    };
}
