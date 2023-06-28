import { EngineEventType, GlobalStoreModule, HealthPointsSource, RecursivePartial } from '@bananos/types';
import { EngineManager, checkIfPackageIsValid } from 'apps/engine/src/app/testUtilities';
import { Classes } from 'apps/engine/src/app/types/Classes';
import { merge } from 'lodash';
import { Character, CharacterType } from '../../../types';
import { CharacterRespawn, WalkingType } from '../../../types/CharacterRespawn';
import { CharacterUnion } from '../../../types/CharacterUnion';
import { MonsterTemplate, MonsterTemplates } from '../../MonsterModule/MonsterTemplates';
import { MonsterRespawnTemplateService } from '../../MonsterModule/dataProviders';
import { Monster } from '../../MonsterModule/types';
import { ApplyTargetSpellEffectEvent, SpellEngineEvents } from '../../SpellModule/Events';
import { SpellEffect, SpellEffectType } from '../../SpellModule/types/SpellTypes';
import _ = require('lodash');

jest.mock("../../MonsterModule/dataProviders/MonsterRespawnTemplateService", () => {
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

interface setupProps {
    monsterTemplates: Record<string, CharacterRespawn<MonsterTemplate>>
    playerAmount: number;
}

const setupEngine = ({ monsterTemplates, playerAmount }: RecursivePartial<setupProps> = {}) => {
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
    const calculatedPlayerAmount = playerAmount ?? 1;
    const monsterRespawnTemplateService = new MonsterRespawnTemplateService();
    (monsterRespawnTemplateService.getData as jest.Mock).mockReturnValue(calculatedMonsterTemplates);

    const engineManager = new EngineManager();

    const internalPlayers = {};

    for (let i = 0; i < calculatedPlayerAmount; i++) {
        internalPlayers[i + 1] = engineManager.preparePlayerWithCharacter({ name: 'character_' + i, class: Classes.Tank })
    }

    let initialDataPackage = engineManager.getLatestPlayerDataPackage(internalPlayers[calculatedPlayerAmount].socketId);

    return { engineManager, players: internalPlayers, monsterTemplates: calculatedMonsterTemplates, initialDataPackage };
};

describe('Power points service', () => {
    it('Player should be notified if he monster is beeing hit', () => {
        const startingLocation = { x: 0, y: 0 };
        const { players, engineManager } = setupEngine({
            monsterTemplates: {
                '1': { location: startingLocation, characterTemplate: { sightRange: 200, desiredRange: 1, healthPoints: 100 } },
            }
        });
        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        let [monster1]: Monster[] = _.filter(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

        engineManager.createSystemAction<ApplyTargetSpellEffectEvent>({
            type: SpellEngineEvents.ApplyTargetSpellEffect,
            caster: { id: players['1'].characterId } as Character,
            target: monster1,
            effect: {
                type: SpellEffectType.Damage,
                amount: 10,
                spellId: "SPELL_ID"
            } as SpellEffect,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        checkIfPackageIsValid(GlobalStoreModule.CHARACTER_POWER_POINTS, dataPackage, {
            data: {
                monster_0: {
                    currentHp: 90,
                }
            },
            events: [
                {
                    type: EngineEventType.CharacterLostHp,
                    amount: 10,
                    attackerId: "playerCharacter_1",
                    characterId: "monster_0",
                    spellId: "SPELL_ID"
                }
            ]
        });
    });

    it('Player should be notified when he heals another player', () => {
        const startingLocation = { x: 1000, y: 1000 };
        const { players, engineManager } = setupEngine({
            playerAmount: 2,
            monsterTemplates: {
                '1': { location: startingLocation, characterTemplate: { sightRange: 200, desiredRange: 1, healthPoints: 100 } },
            },
        });

        engineManager.createSystemAction<ApplyTargetSpellEffectEvent>({
            type: SpellEngineEvents.ApplyTargetSpellEffect,
            caster: { id: players['1'].characterId } as Character,
            target: { id: players['2'].characterId } as Character,
            effect: {
                type: SpellEffectType.Heal,
                amount: 10,
                spellId: "SPELL_ID"
            } as SpellEffect,
        });

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        checkIfPackageIsValid(GlobalStoreModule.CHARACTER_POWER_POINTS, dataPackage, {
            data: {
                playerCharacter_2: {
                    currentHp: 400,
                }
            },
            events: [
                {
                    type: EngineEventType.CharacterGotHp,
                    amount: 10,
                    healerId: "playerCharacter_1",
                    characterId: "playerCharacter_2",
                    spellId: "SPELL_ID",
                    source: HealthPointsSource.Healing
                }
            ]
        });
    });
});
