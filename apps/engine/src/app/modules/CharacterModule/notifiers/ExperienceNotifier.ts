import { CharacterClientEvents, CharacterType, ExperienceExternalTrack, GlobalStoreModule } from '@bananos/types';
import * as _ from 'lodash';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import type { CharacterGainExperienceEvent, CharacterLevelChangedEvent, ExperienceTrackCreatedEvent, ExperienceTrackRemovedEvent } from '../Events';
import { CharacterEngineEvents } from '../Events';
import { ExperienceTable } from '../ExperienceTable';

export class ExperienceNotifier extends Notifier<Partial<ExperienceExternalTrack>> {
    constructor() {
        super({ key: GlobalStoreModule.EXPERIENCE });
        this.eventsToHandlersMap = {
            [CharacterEngineEvents.ExperienceTrackCreated]: this.handleExperienceTrackCreated,
            [CharacterEngineEvents.ExperienceTrackRemoved]: this.handleExperienceTrackRemoved,
            [CharacterEngineEvents.CharacterGainExperience]: this.handleCharacterGainExperience,
            [CharacterEngineEvents.CharacterLevelChanged]: this.handleCharacterLevelChanged,
            [PlayerEngineEvents.PlayerCharacterCreated]: this.handlePlayerCharacterCreated,
        };
    }

    handleExperienceTrackCreated: EngineEventHandler<ExperienceTrackCreatedEvent> = ({ event, services }) => {
        this.broadcastObjectsUpdate({
            objects: { [event.trackId]: { level: event.experienceTrack.level } },
        });

        const character = services.characterService.getCharacterById(event.experienceTrack.ownerCharacterId);

        if (!character || character?.type !== CharacterType.Player) {
            return;
        }

        this.multicastMultipleObjectsUpdate([
            {
                receiverId: character.ownerId,
                objects: {
                    [event.trackId]: {
                        level: event.experienceTrack.level,
                        experienceAmount: event.experienceTrack.experienceAmount,
                        toNextLevel: ExperienceTable[event.experienceTrack.level],
                    },
                },
            },
        ]);
    };

    handleExperienceTrackRemoved: EngineEventHandler<ExperienceTrackRemovedEvent> = ({ event }) => {
        this.broadcastObjectsDeletion({
            objects: { [event.trackId]: null },
        });
    };

    handlePlayerCharacterCreated: EngineEventHandler<PlayerCharacterCreatedEvent> = ({ event, services }) => {
        this.multicastMultipleObjectsUpdate([
            {
                receiverId: event.playerCharacter.ownerId,
                objects: _.mapValues(services.experienceService.getExperienceTracks(), (experienceTrack) => ({
                    level: experienceTrack.level,
                })),
            },
        ]);
    };

    handleCharacterLevelChanged: EngineEventHandler<CharacterLevelChangedEvent> = ({ event, services }) => {
        this.broadcastEvents({
            events: [
                {
                    type: CharacterClientEvents.LevelChanged,
                    characterId: event.characterId,
                    level: event.newLevel,
                },
            ],
        });

        this.broadcastObjectsUpdate({
            objects: { [event.characterId]: { level: event.newLevel } },
        });

        const character = services.characterService.getCharacterById(event.characterId);
        if (character.type !== CharacterType.Player) {
            return;
        }

        this.multicastMultipleObjectsUpdate([
            {
                receiverId: character.ownerId,
                objects: {
                    [event.characterId]: {
                        level: event.newLevel,
                        toNextLevel: ExperienceTable[event.newLevel],
                    },
                },
            },
        ]);
    };

    handleCharacterGainExperience: EngineEventHandler<CharacterGainExperienceEvent> = ({ event, services }) => {
        const character = services.characterService.getCharacterById(event.characterId);
        if (character.type !== CharacterType.Player) {
            return;
        }

        this.multicastMultipleObjectsUpdate([
            {
                receiverId: character.ownerId,
                objects: {
                    [event.characterId]: {
                        experienceAmount: event.experienceTrack.experienceAmount,
                    },
                },
            },
        ]);

        this.multicastEvents([
            {
                receiverId: character.ownerId,
                events: [
                    {
                        type: CharacterClientEvents.ExperienceGain,
                        characterId: event.characterId,
                        amount: event.amount,
                        experienceGainDetails: event.experienceGainDetails,
                    },
                ],
            },
        ]);
    };
}
