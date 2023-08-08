import type { PowerPointsTrack } from '@bananos/types';
import { HealthPointsSource } from '@bananos/types';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import { CharacterDiedEvent, CharacterType, EngineEventHandler } from '../../../types';
import { CharacterUnion } from '../../../types/CharacterUnion';
import { Services } from '../../../types/Services';
import type {
    AddCharacterHealthPointsEvent,
    AddCharacterSpellPowerEvent,
    CharacterGotHpEvent,
    CharacterGotSpellPowerEvent,
    CharacterLostHpEvent,
    CharacterLostSpellPowerEvent,
    NewCharacterCreatedEvent,
    NewPowerTrackCreatedEvent,
    RemoveCharacterEvent,
    ResetCharacterEvent,
    TakeCharacterHealthPointsEvent,
    TakeCharacterSpellPowerEvent,
} from '../Events';
import { CharacterEngineEvents } from '../Events';

interface PowerPoints {
    healthPoints: number,
    spellPower: number,
}

export class PowerPointsService extends EventParser {
    private powerPoints: Record<string, PowerPointsTrack> = {};

    constructor() {
        super();
        this.eventsToHandlersMap = {
            [CharacterEngineEvents.NewCharacterCreated]: this.handleNewCharacterCreated,
            [CharacterEngineEvents.TakeCharacterHealthPoints]: this.handleTakeCharacterHealthPoints,
            [CharacterEngineEvents.AddCharacterHealthPoints]: this.handleAddCharacterHealthPoints,
            [CharacterEngineEvents.TakeCharacterSpellPower]: this.handleTakeCharacterSpellPower,
            [CharacterEngineEvents.AddCharacterSpellPower]: this.handleAddCharacterSpellPower,
            [CharacterEngineEvents.ResetCharacter]: this.handleResetCharacter,
            [CharacterEngineEvents.RemoveCharacter]: this.handleRemoveCharacter,
        };
    }

    getCharacterPowerPointsStats = (character: CharacterUnion, services: Services) => {
        if (character.type === CharacterType.Player) {
            return services.characterClassService.getData()[character.characterClassId];
        }

        if (character.type === CharacterType.Monster) {
            return services.monsterTemplateService.getData()[character.templateId];
        }

        if (character.type === CharacterType.Npc) {
            return services.npcTemplateService.getData()[character.templateId];
        }
    }

    handleNewCharacterCreated: EngineEventHandler<NewCharacterCreatedEvent> = ({ event, services }) => {
        const powerPoints: PowerPoints = this.getCharacterPowerPointsStats(event.character, services);

        this.powerPoints[event.character.id] = {
            currentHp: powerPoints.healthPoints,
            maxHp: powerPoints.healthPoints,
            currentSpellPower: powerPoints.spellPower,
            maxSpellPower: powerPoints.spellPower,
        };

        this.engineEventCrator.asyncCeateEvent<NewPowerTrackCreatedEvent>({
            type: CharacterEngineEvents.NewPowerTrackCreated,
            powerPoints: this.powerPoints[event.character.id],
            characterId: event.character.id,
        });
    };

    handleTakeCharacterHealthPoints: EngineEventHandler<TakeCharacterHealthPointsEvent> = ({ event, services }) => {
        if (this.powerPoints[event.characterId]) {
            this.powerPoints[event.characterId].currentHp = Math.max(this.powerPoints[event.characterId].currentHp - event.amount, 0);

            this.engineEventCrator.asyncCeateEvent<CharacterLostHpEvent>({
                type: CharacterEngineEvents.CharacterLostHp,
                characterId: event.characterId,
                amount: event.amount,
                currentHp: this.powerPoints[event.characterId].currentHp,
                attackerId: event.attackerId,
                spellId: event.spellId
            });

            if (this.powerPoints[event.characterId].currentHp === 0) {
                delete this.powerPoints[event.characterId];
                this.engineEventCrator.asyncCeateEvent<CharacterDiedEvent>({
                    type: EngineEvents.CharacterDied,
                    character: services.characterService.getAllCharacters()[event.characterId],
                    characterId: event.characterId,
                    killerId: event.attackerId,
                });
            }
        }
    };

    handleAddCharacterHealthPoints: EngineEventHandler<AddCharacterHealthPointsEvent> = ({ event }) => {
        if (this.powerPoints[event.characterId]) {
            this.powerPoints[event.characterId].currentHp = Math.min(
                this.powerPoints[event.characterId].currentHp + event.amount,
                this.powerPoints[event.characterId].maxHp
            );

            this.engineEventCrator.asyncCeateEvent<CharacterGotHpEvent>({
                type: CharacterEngineEvents.CharacterGotHp,
                characterId: event.characterId,
                amount: event.amount,
                currentHp: this.powerPoints[event.characterId].currentHp,
                source: event.source,
                healerId: event.casterId,
                spellId: event.spellId
            });
        }
    };

    handleTakeCharacterSpellPower: EngineEventHandler<TakeCharacterSpellPowerEvent> = ({ event }) => {
        if (this.powerPoints[event.characterId]) {
            this.powerPoints[event.characterId].currentSpellPower -= event.amount;

            this.engineEventCrator.asyncCeateEvent<CharacterLostSpellPowerEvent>({
                type: CharacterEngineEvents.CharacterLostSpellPower,
                characterId: event.characterId,
                amount: event.amount,
                currentSpellPower: this.powerPoints[event.characterId].currentSpellPower,
            });
        }
    };

    handleAddCharacterSpellPower: EngineEventHandler<AddCharacterSpellPowerEvent> = ({ event }) => {
        if (this.powerPoints[event.characterId]) {
            this.powerPoints[event.characterId].currentSpellPower = Math.min(
                this.powerPoints[event.characterId].currentSpellPower + event.amount,
                this.powerPoints[event.characterId].maxSpellPower
            );

            this.engineEventCrator.asyncCeateEvent<CharacterGotSpellPowerEvent>({
                type: CharacterEngineEvents.CharacterGotSpellPower,
                characterId: event.characterId,
                amount: event.amount,
                currentSpellPower: this.powerPoints[event.characterId].currentSpellPower,
            });
        }
    };

    handleResetCharacter: EngineEventHandler<ResetCharacterEvent> = ({ event }) => {
        const character = this.powerPoints[event.characterId];
        const healthPointsToMax = character.maxHp - character.currentHp;

        character.currentHp = character.maxHp;
        character.currentSpellPower = character.maxSpellPower;

        this.engineEventCrator.asyncCeateEvent<CharacterGotHpEvent>({
            type: CharacterEngineEvents.CharacterGotHp,
            characterId: event.characterId,
            amount: healthPointsToMax,
            currentHp: character.currentHp,
            source: HealthPointsSource.CharacterReset,
            spellId: null,
            healerId: null
        });
    };

    handleRemoveCharacter: EngineEventHandler<RemoveCharacterEvent> = ({ event }) => {
        delete this.powerPoints[event.character.id];
    };

    getAllPowerTracks = () => this.powerPoints;

    getHealthPoints = (id: string) => this.powerPoints[id].currentHp;

    getSpellPower = (id: string) => this.powerPoints[id].currentSpellPower;
}
