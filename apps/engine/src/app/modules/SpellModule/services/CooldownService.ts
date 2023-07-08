import { EngineEventCrator } from '../../../EngineEventsCreator';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import { CharacterEngineEvents, CharacterRemovedEvent, NewCharacterCreatedEvent } from '../../CharacterModule/Events';
import { PlayerCastSpellEvent, PlayerCastedSpellEvent, SpellEngineEvents } from '../Events';

export class CooldownService extends EventParser {
    spellsAvailabilityPerUser: Record<string, Record<string, number>> = {};

    constructor() {
        super();
        this.eventsToHandlersMap = {
            [SpellEngineEvents.PlayerCastedSpell]: this.handlePlayerCastedSpell,
            [CharacterEngineEvents.NewCharacterCreated]: this.handleNewCharacterCreated,
            [CharacterEngineEvents.CharacterRemoved]: this.handleCharacterRemoved,
            [SpellEngineEvents.PlayerCastSpell]: this.handlePlayerCastSpell,
            // TODO: CLEAR OLD VALUES ABOUT MONSTER WHEN IT DIES
        };
    }

    init(engineEventCrator: EngineEventCrator) {
        super.init(engineEventCrator);
    }

    handleNewCharacterCreated: EngineEventHandler<NewCharacterCreatedEvent> = ({ event }) => {
        this.spellsAvailabilityPerUser[event.character.id] = {};
    };

    handlePlayerCastedSpell: EngineEventHandler<PlayerCastedSpellEvent> = ({ event }) => {
        if (event.casterId) {
            this.spellsAvailabilityPerUser[event.casterId][event.spell.id] = Date.now() + event.spell.cooldown;
        }
    };

    handleCharacterRemoved: EngineEventHandler<CharacterRemovedEvent> = ({ event }) => {
        delete this.spellsAvailabilityPerUser[event.character.id];
    };

    isSpellAvailable = (characterId: string, spellId: string) => {
        if (!this.spellsAvailabilityPerUser[characterId]) {
            throw new Error('Character not registered');
        }

        const spellAvailability = this.spellsAvailabilityPerUser[characterId][spellId];

        if (!spellAvailability) {
            return true;
        }

        return Date.now() > spellAvailability;
    };

    handlePlayerCastSpell: EngineEventHandler<PlayerCastSpellEvent> = ({ event }) => {
        if (event.casterId) {
            // TODO: Bug, it should happen when spell was really cast, not when player only tries to do it
            this.spellsAvailabilityPerUser[event.casterId][event.spell.id] = Date.now() + event.spell.cooldown;
        }
    };
}
