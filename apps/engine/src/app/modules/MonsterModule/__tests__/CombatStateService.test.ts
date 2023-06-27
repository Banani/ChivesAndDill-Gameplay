import { GlobalStoreModule, RecursivePartial } from '@bananos/types';
import { EngineManager, checkIfPackageIsValid } from 'apps/engine/src/app/testUtilities';
import { Classes } from 'apps/engine/src/app/types/Classes';
import { merge } from 'lodash';
import { Character, CharacterType } from '../../../types';
import { CharacterRespawn, WalkingType } from '../../../types/CharacterRespawn';
import { CharacterUnion } from '../../../types/CharacterUnion';
import { ApplyTargetSpellEffectEvent, SpellEngineEvents } from '../../SpellModule/Events';
import { SpellEffect, SpellEffectType } from '../../SpellModule/types/SpellTypes';
import { MonsterTemplate, MonsterTemplates } from '../MonsterTemplates';
import { MonsterRespawnTemplateService } from '../dataProviders';
import { Monster } from '../types';
import _ = require('lodash');

jest.mock('../dataProviders/MonsterRespawnTemplateService', () => {
    const getData = jest.fn();

    return {
        MonsterRespawnTemplateService: function () {
            return {
                init: jest.fn(),
                handleEvent: jest.fn(),
                getData,
            };
        },
    };
});

jest.mock('../../NpcModule/services/NpcRespawnTemplateService', () => {
    const getData = jest.fn().mockReturnValue({});

    return {
        NpcRespawnTemplateService: function () {
            return {
                init: jest.fn(),
                handleEvent: jest.fn(),
                getData,
            };
        },
    };
});

const setupEngine = ({ monsterTemplates }: RecursivePartial<{ monsterTemplates: Record<string, CharacterRespawn<MonsterTemplate>> }> = {}) => {
    const calculatedMonsterTemplates = merge(
        {},
        {
            '1': {
                id: '1',
                location: { x: 150, y: 100 },
                characterTemplate: { ...MonsterTemplates['Orc'], sightRange: 300 },
                time: 4000,
                walkingType: WalkingType.None,
            },
        },
        monsterTemplates
    );
    const monsterRespawnTemplateService = new MonsterRespawnTemplateService();
    (monsterRespawnTemplateService.getData as jest.Mock).mockReturnValue(calculatedMonsterTemplates);

    const engineManager = new EngineManager();

    const players = {
        '1': engineManager.preparePlayerWithCharacter({ name: 'character_1', class: Classes.Tank }),
    };
    let initialDataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

    return { engineManager, players, monsterTemplates: calculatedMonsterTemplates, initialDataPackage };
};

describe('Combat state service', () => {
    it('Player should be in combat state when monster starts fight', () => {
        const { players, engineManager } = setupEngine();

        const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(GlobalStoreModule.COMBAT_STATE, dataPackage, {
            data: {
                playerCharacter_1: true
            },
        });
    });

    it('Player should not be in combat state if the monster is already dead', () => {
        const startingLocation = { x: 100, y: 100 };
        const { players, engineManager } = setupEngine({
            monsterTemplates: { '1': { location: startingLocation, characterTemplate: { sightRange: 200, desiredRange: 1, healthPoints: 100 } } },
        });
        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const monster: Monster = _.find(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

        engineManager.createSystemAction<ApplyTargetSpellEffectEvent>({
            type: SpellEngineEvents.ApplyTargetSpellEffect,
            caster: { id: players['1'].characterId } as Character,
            target: monster,
            effect: {
                type: SpellEffectType.Damage,
                amount: 200,
            } as SpellEffect,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        checkIfPackageIsValid(GlobalStoreModule.COMBAT_STATE, dataPackage, {
            data: {
                playerCharacter_1: false
            },
        });
    });

    it('Player should be in combat if he is fighting two enemies, and he kills only one of them', () => {
        const startingLocation = { x: 100, y: 100 };
        const { players, engineManager } = setupEngine({
            monsterTemplates: {
                '1': { location: startingLocation, characterTemplate: { sightRange: 200, desiredRange: 1, healthPoints: 100 } },
                '2': {
                    id: '2',
                    location: { x: 100, y: 100 },
                    characterTemplate: { ...MonsterTemplates['Orc'], sightRange: 200 },
                    time: 4000,
                    walkingType: WalkingType.None,
                }
            },
        });
        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const monster: Monster = _.find(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

        engineManager.createSystemAction<ApplyTargetSpellEffectEvent>({
            type: SpellEngineEvents.ApplyTargetSpellEffect,
            caster: { id: players['1'].characterId } as Character,
            target: monster,
            effect: {
                type: SpellEffectType.Damage,
                amount: 200,
            } as SpellEffect,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        checkIfPackageIsValid(GlobalStoreModule.COMBAT_STATE, dataPackage, undefined);
    });

    it('Player should not be in combat if he kill all his enemies', () => {
        const startingLocation = { x: 100, y: 100 };
        const { players, engineManager } = setupEngine({
            monsterTemplates: {
                '1': { location: startingLocation, characterTemplate: { sightRange: 200, desiredRange: 1, healthPoints: 100 } },
                '2': {
                    id: '2',
                    location: { x: 100, y: 100 },
                    characterTemplate: { ...MonsterTemplates['Orc'], sightRange: 200 },
                    time: 4000,
                    walkingType: WalkingType.None,
                }
            },
        });
        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        let [monster1, monster2]: Monster[] = _.filter(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

        engineManager.createSystemAction<ApplyTargetSpellEffectEvent>({
            type: SpellEngineEvents.ApplyTargetSpellEffect,
            caster: { id: players['1'].characterId } as Character,
            target: monster1,
            effect: {
                type: SpellEffectType.Damage,
                amount: 200,
            } as SpellEffect,
        });

        engineManager.createSystemAction<ApplyTargetSpellEffectEvent>({
            type: SpellEngineEvents.ApplyTargetSpellEffect,
            caster: { id: players['1'].characterId } as Character,
            target: monster2,
            effect: {
                type: SpellEffectType.Damage,
                amount: 200,
            } as SpellEffect,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        checkIfPackageIsValid(GlobalStoreModule.COMBAT_STATE, dataPackage, {
            data: {
                playerCharacter_1: false
            }
        });
    });
});
