import { CharacterType, ExperienceGainSource } from '@bananos/types';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import type { CharacterDiedEvent, EngineEventHandler } from '../../../types';
import { QuestCompletedEvent, QuestEngineEvents } from '../../QuestModule/Events';
import type {
    AddExperienceEvent,
    CharacterGainExperienceEvent,
    CharacterLevelChangedEvent,
    ExperienceTrackCreatedEvent,
    ExperienceTrackRemovedEvent,
    NewCharacterCreatedEvent,
} from '../Events';
import { CharacterEngineEvents } from '../Events';
import { ExperienceTable } from '../ExperienceTable';
import type { ExperienceTrack } from '../types';

export class ExperienceService extends EventParser {
    // character id
    private experienceTracks: Record<string, ExperienceTrack> = {};

    constructor() {
        super();
        this.eventsToHandlersMap = {
            [CharacterEngineEvents.NewCharacterCreated]: this.handleNewCharacterCreated,
            [CharacterEngineEvents.AddExperience]: this.handleAddExperience,

            [EngineEvents.CharacterDied]: this.handleCharacterDied,
            [QuestEngineEvents.QuestCompleted]: this.handleQuestCompleted,
        };
    }

    handleNewCharacterCreated: EngineEventHandler<NewCharacterCreatedEvent> = ({ event }) => {
        this.experienceTracks[event.character.id] = {
            experienceAmount: 0,
            level: 1,
            ownerCharacterId: event.character.id,
        };

        this.engineEventCrator.asyncCeateEvent<ExperienceTrackCreatedEvent>({
            type: CharacterEngineEvents.ExperienceTrackCreated,
            experienceTrack: this.experienceTracks[event.character.id],
            trackId: event.character.id,
        });
    };

    handleAddExperience: EngineEventHandler<AddExperienceEvent> = ({ event, services }) => {
        let amountToAdd = event.amount;
        const currentTrack = this.experienceTracks[event.characterId];

        if (!ExperienceTable[currentTrack.level]) {
            return;
        }

        while (amountToAdd) {
            const changeOnThisIteration = Math.min(ExperienceTable[currentTrack.level] - currentTrack.experienceAmount, amountToAdd);
            this.experienceTracks[event.characterId].experienceAmount += changeOnThisIteration;
            amountToAdd -= changeOnThisIteration;

            if (currentTrack.experienceAmount === ExperienceTable[currentTrack.level]) {
                currentTrack.level += 1;
                currentTrack.experienceAmount = 0;

                this.engineEventCrator.asyncCeateEvent<CharacterLevelChangedEvent>({
                    type: CharacterEngineEvents.CharacterLevelChanged,
                    newLevel: currentTrack.level,
                    characterId: event.characterId,
                });

                if (!ExperienceTable[currentTrack.level]) {
                    amountToAdd = 0;
                }
            }
        }

        this.engineEventCrator.asyncCeateEvent<CharacterGainExperienceEvent>({
            type: CharacterEngineEvents.CharacterGainExperience,
            experienceTrack: currentTrack,
            amount: event.amount,
            characterId: event.characterId,
            experienceGainDetails: event.experienceGainDetails,
        });
    };

    handleCharacterDied: EngineEventHandler<CharacterDiedEvent> = ({ event, services }) => {
        const character = services.characterService.getCharacterById(event.killerId);

        if (!character || character.type !== CharacterType.Player) {
            return;
        }

        this.engineEventCrator.asyncCeateEvent<AddExperienceEvent>({
            type: CharacterEngineEvents.AddExperience,
            characterId: event.killerId,
            amount: 250,
            experienceGainDetails: {
                type: ExperienceGainSource.MonsterKill,
                monsterId: event.characterId,
            },
        });

        delete this.experienceTracks[event.characterId];

        this.engineEventCrator.asyncCeateEvent<ExperienceTrackRemovedEvent>({
            type: CharacterEngineEvents.ExperienceTrackRemoved,
            trackId: event.characterId,
        });
    };

    getExperienceTracks = () => this.experienceTracks;

    handleQuestCompleted: EngineEventHandler<QuestCompletedEvent> = ({ event, services }) => {
        const { questReward } = services.questSchemasService.getData()[event.questId];
        this.engineEventCrator.asyncCeateEvent<AddExperienceEvent>({
            type: CharacterEngineEvents.AddExperience,
            characterId: event.characterId,
            amount: questReward.experience,
            experienceGainDetails: {
                type: ExperienceGainSource.QuestCompleted,
            },
        });
    };
}
