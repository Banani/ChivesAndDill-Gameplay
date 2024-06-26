import type { PowerPointsTrack } from '@bananos/types';
import { CharacterClientEvents, GlobalStoreModule, HealthPointsSource } from '@bananos/types';
import { EngineEvents } from '../../../EngineEvents';
import { Notifier } from '../../../Notifier';
import type { CharacterDiedEvent, EngineEventHandler } from '../../../types';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import type {
    CharacterGotHpEvent,
    CharacterGotSpellPowerEvent,
    CharacterLostHpEvent,
    CharacterLostSpellPowerEvent,
    NewPowerTrackCreatedEvent,
} from '../Events';
import { CharacterEngineEvents } from '../Events';

export class PowerPointsNotifier extends Notifier<PowerPointsTrack> {
    constructor() {
        super({ key: GlobalStoreModule.CHARACTER_POWER_POINTS });
        this.eventsToHandlersMap = {
            [PlayerEngineEvents.PlayerCharacterCreated]: this.handlePlayerCharacterCreated,

            [CharacterEngineEvents.NewPowerTrackCreated]: this.handleNewPowerTrackCreated,
            [CharacterEngineEvents.CharacterLostHp]: this.handleCharacterLostHp,
            [CharacterEngineEvents.CharacterGotHp]: this.handleCharacterGotHp,
            [CharacterEngineEvents.CharacterLostSpellPower]: this.handleCharacterLostSpellPower,
            [CharacterEngineEvents.CharacterGotSpellPower]: this.handleCharacterGotSpellPower,

            [EngineEvents.CharacterDied]: this.handleCharacterDied,
        };
    }

    handlePlayerCharacterCreated: EngineEventHandler<PlayerCharacterCreatedEvent> = ({ event, services }) => {
        this.multicastMultipleObjectsUpdate([
            {
                receiverId: event.playerCharacter.ownerId,
                objects: services.powerPointsService.getAllPowerTracks(),
            },
        ]);
    };

    handleNewPowerTrackCreated: EngineEventHandler<NewPowerTrackCreatedEvent> = ({ event, services }) => {
        this.broadcastObjectsUpdate({
            objects: { [event.characterId]: event.powerPoints },
        });
    };

    handleCharacterDied: EngineEventHandler<CharacterDiedEvent> = ({ event }) => {
        this.broadcastObjectsDeletion({ objects: { [event.characterId]: null } });
    };

    handleCharacterLostHp: EngineEventHandler<CharacterLostHpEvent> = ({ event, services }) => {
        const character = services.characterService.getCharacterById(event.characterId);

        this.broadcastEvents({
            events: [
                {
                    type: CharacterClientEvents.CharacterLostHp,
                    characterId: event.characterId,
                    amount: event.amount,
                    attackerId: event.attackerId,
                    spellId: event.spellId,
                    location: { x: character.location.x, y: character.location.y }
                },
            ],
        });
        this.broadcastObjectsUpdate({
            objects: { [event.characterId]: { currentHp: event.currentHp } },
        });
    };

    handleCharacterGotHp: EngineEventHandler<CharacterGotHpEvent> = ({ event, services }) => {
        if (event.source !== HealthPointsSource.Regeneration) {
            const character = services.characterService.getCharacterById(event.characterId);

            this.broadcastEvents({
                events: [
                    {
                        type: CharacterClientEvents.CharacterGotHp,
                        characterId: event.characterId,
                        amount: event.amount,
                        source: event.source,
                        healerId: event.healerId,
                        spellId: event.spellId,
                        location: { x: character.location.x, y: character.location.y }
                    },
                ],
            });
        }

        this.broadcastObjectsUpdate({
            objects: { [event.characterId]: { currentHp: event.currentHp } },
        });
    };

    handleCharacterLostSpellPower: EngineEventHandler<CharacterLostSpellPowerEvent> = ({ event }) => {
        this.broadcastObjectsUpdate({
            objects: { [event.characterId]: { currentSpellPower: event.currentSpellPower } },
        });
    };

    handleCharacterGotSpellPower: EngineEventHandler<CharacterGotSpellPowerEvent> = ({ event }) => {
        this.broadcastObjectsUpdate({
            objects: { [event.characterId]: { currentSpellPower: event.currentSpellPower } },
        });
    };
}
