import type { PowerPointsTrack } from '@bananos/types';
import { HealthPointsSource } from '@bananos/types';
import { clone } from 'lodash';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import { CharacterDiedEvent, CharacterType, EngineEventHandler } from '../../../types';
import { Classes } from '../../../types/Classes';
import type {
    AddCharacterHealthPointsEvent,
    AddCharacterSpellPowerEvent,
    CharacterGotHpEvent,
    CharacterGotSpellPowerEvent,
    CharacterLostHpEvent,
    CharacterLostSpellPowerEvent,
    NewCharacterCreatedEvent,
    NewPowerTrackCreatedEvent,
    ResetCharacterEvent,
    TakeCharacterHealthPointsEvent,
    TakeCharacterSpellPowerEvent,
} from '../Events';
import { CharacterEngineEvents } from '../Events';

const classesBaseStats: Record<Classes, PowerPointsTrack> = {
    [Classes.Tank]: {
        currentHp: 400,
        maxHp: 400,
        currentSpellPower: 0,
        maxSpellPower: 100,
    },
    [Classes.Healer]: {
        currentHp: 25000,
        maxHp: 25000,
        currentSpellPower: 2000,
        maxSpellPower: 2000,
    },
    [Classes.Hunter]: {
        currentHp: 300,
        maxHp: 300,
        currentSpellPower: 100,
        maxSpellPower: 100,
    },
    [Classes.Mage]: {
        currentHp: 300,
        maxHp: 300,
        currentSpellPower: 2000,
        maxSpellPower: 2000,
    },
};

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
        };
    }

    handleNewCharacterCreated: EngineEventHandler<NewCharacterCreatedEvent> = ({ event, services }) => {
        if (event.character.type === CharacterType.Player) {
            this.powerPoints[event.character.id] = clone(classesBaseStats[event.character.class]);
        }

        if (event.character.type === CharacterType.Monster) {
            const monsterRespawns = services.monsterRespawnTemplateService.getData();
            const respawn = monsterRespawns[event.character.respawnId];
            this.powerPoints[event.character.id] = {
                currentHp: respawn.characterTemplate.healthPoints,
                maxHp: respawn.characterTemplate.healthPoints,
                currentSpellPower: respawn.characterTemplate.spellPower,
                maxSpellPower: respawn.characterTemplate.spellPower,
            };
        }
        // TODO: powinno byc jakies wspolne rozwiazanie dla wszystkich
        if (event.character.type === CharacterType.Npc) {
            const template = services.npcTemplateService.getData()[event.character.templateId];
            this.powerPoints[event.character.id] = {
                currentHp: template.healthPoints,
                maxHp: template.healthPoints,
                currentSpellPower: template.spellPower,
                maxSpellPower: template.spellPower,
            };
        }

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

    getAllPowerTracks = () => this.powerPoints;

    getHealthPoints = (id: string) => this.powerPoints[id].currentHp;

    getSpellPower = (id: string) => this.powerPoints[id].currentSpellPower;
}
