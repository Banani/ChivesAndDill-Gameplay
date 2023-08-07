import { CharacterClientEvents, ExperienceGainSource, GlobalStoreModule } from '@bananos/types';
import { EngineManager, checkIfPackageIsValid } from 'apps/engine/src/app/testUtilities';
import { QuestCompletedEvent, QuestEngineEvents, StartQuestEvent } from '../../QuestModule/Events';
import { AddExperienceEvent, CharacterEngineEvents } from '../Events';
import _ = require('lodash');

const CURRENT_MODULE = GlobalStoreModule.EXPERIENCE;

const setupEngine = () => {
    const engineManager = new EngineManager();

    const players = {
        '1': engineManager.preparePlayerWithCharacter({ name: 'character_1' }),
        '2': engineManager.preparePlayerWithCharacter({ name: 'character_2' }),
    };

    return { engineManager, players };
};

describe('Character experience', () => {
    it('When character is created he should be informed about his experience track and other characters level', () => {
        const { engineManager, players } = setupEngine();

        const dataPackage = engineManager.getLatestPlayerDataPackage(players['2'].socketId);

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
            data: { playerCharacter_1: { level: 1 }, playerCharacter_2: { experienceAmount: 0, level: 1, toNextLevel: 250 } },
        });
    });

    it('When character is created other players should be informed about his level', () => {
        const { engineManager, players } = setupEngine();

        const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
            data: { playerCharacter_2: { level: 1 } },
        });
    });

    it('Player should be notifier when his character is gaining experience', () => {
        const { engineManager, players } = setupEngine();

        engineManager.createSystemAction<AddExperienceEvent>({
            type: CharacterEngineEvents.AddExperience,
            amount: 100,
            characterId: players['1'].characterId,
            experienceGainDetails: {
                type: ExperienceGainSource.MonsterKill,
                monsterId: '123',
            },
        });

        const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
            data: { playerCharacter_1: { experienceAmount: 100 } },
            events: [
                {
                    id: "1",
                    amount: 100,
                    characterId: 'playerCharacter_1',
                    type: CharacterClientEvents.ExperienceGain,
                    experienceGainDetails: {
                        type: ExperienceGainSource.MonsterKill,
                        monsterId: '123',
                    },
                },
            ],
        });
    });

    it('Other players should not be informed about experience gain', () => {
        const { engineManager, players } = setupEngine();

        engineManager.createSystemAction<AddExperienceEvent>({
            type: CharacterEngineEvents.AddExperience,
            amount: 100,
            characterId: players['1'].characterId,
            experienceGainDetails: {
                type: ExperienceGainSource.MonsterKill,
                monsterId: '123',
            },
        });

        const dataPackage = engineManager.getLatestPlayerDataPackage(players['2'].socketId);

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, undefined);
    });

    it('Other players should not be informed about experience gain', () => {
        const { engineManager, players } = setupEngine();

        engineManager.createSystemAction<AddExperienceEvent>({
            type: CharacterEngineEvents.AddExperience,
            amount: 100,
            characterId: players['1'].characterId,
            experienceGainDetails: {
                type: ExperienceGainSource.MonsterKill,
                monsterId: '123',
            },
        });

        const dataPackage = engineManager.getLatestPlayerDataPackage(players['2'].socketId);

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, undefined);
    });

    it('Player should be notifier when his character is gaining new level', () => {
        const { engineManager, players } = setupEngine();

        engineManager.createSystemAction<AddExperienceEvent>({
            type: CharacterEngineEvents.AddExperience,
            amount: 300,
            characterId: players['1'].characterId,
            experienceGainDetails: {
                type: ExperienceGainSource.MonsterKill,
                monsterId: '123',
            },
        });

        const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
            data: { playerCharacter_1: { experienceAmount: 50, level: 2, toNextLevel: 655 } },
            events: [
                {
                    id: "1",
                    type: CharacterClientEvents.LevelChanged,
                    characterId: 'playerCharacter_1',
                    level: 2,
                },
                {
                    id: "2",
                    amount: 300,
                    characterId: 'playerCharacter_1',
                    type: CharacterClientEvents.ExperienceGain,
                    experienceGainDetails: {
                        type: ExperienceGainSource.MonsterKill,
                        monsterId: '123',
                    },
                },
            ],
        });
    });

    it('Player should be notifier about two level updated, when it happes', () => {
        const { engineManager, players } = setupEngine();

        engineManager.createSystemAction<AddExperienceEvent>({
            type: CharacterEngineEvents.AddExperience,
            amount: 1000,
            characterId: players['1'].characterId,
            experienceGainDetails: {
                type: ExperienceGainSource.MonsterKill,
                monsterId: '123',
            },
        });

        const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
            data: { playerCharacter_1: { experienceAmount: 95, level: 3, toNextLevel: 1265 } },
            events: [
                {
                    id: "1",
                    type: CharacterClientEvents.LevelChanged,
                    characterId: 'playerCharacter_1',
                    level: 2,
                },
                {
                    id: "2",
                    type: CharacterClientEvents.LevelChanged,
                    characterId: 'playerCharacter_1',
                    level: 3,
                },
                {
                    id: "3",
                    amount: 1000,
                    characterId: 'playerCharacter_1',
                    type: CharacterClientEvents.ExperienceGain,
                    experienceGainDetails: {
                        type: ExperienceGainSource.MonsterKill,
                        monsterId: '123',
                    },
                },
            ],
        });
    });

    it('Player should get experience when quest is completed', () => {
        const { players, engineManager } = setupEngine();

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        engineManager.createSystemAction<StartQuestEvent>({
            type: QuestEngineEvents.StartQuest,
            characterId: players['1'].characterId,
            questId: '1',
        });

        engineManager.createSystemAction<QuestCompletedEvent>({
            type: QuestEngineEvents.QuestCompleted,
            characterId: players['1'].characterId,
            questId: '1',
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(GlobalStoreModule.EXPERIENCE, dataPackage, {
            data: {
                playerCharacter_1: {
                    experienceAmount: 120,
                },
            },
            events: [
                {
                    id: "1",
                    amount: 120,
                    characterId: 'playerCharacter_1',
                    experienceGainDetails: {
                        type: ExperienceGainSource.QuestCompleted,
                    },
                    type: CharacterClientEvents.ExperienceGain,
                },
            ],
        });
    });
});
