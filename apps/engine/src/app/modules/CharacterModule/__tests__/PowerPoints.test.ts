import { Attribute, CharacterClientEvents, DamageEffect, GlobalStoreModule, HealEffect, HealthPointsSource, RecursivePartial, SpellEffectType } from '@bananos/types';
import { EngineManager, checkIfPackageIsValid } from 'apps/engine/src/app/testUtilities';
import { MockedMonsterTemplates } from '../../../mocks';
import { RandomGeneratorService } from '../../../services/RandomGeneratorService';
import { Character, CharacterType } from '../../../types';
import { WalkingType } from '../../../types/CharacterRespawn';
import { CharacterUnion } from '../../../types/CharacterUnion';
import { MonsterEngineEvents, MonsterRespawnsUpdatedEvent } from '../../MonsterModule/Events';
import { MonsterTemplate } from '../../MonsterModule/MonsterTemplates';
import { MonsterRespawnTemplateService, MonsterTemplateService } from '../../MonsterModule/services';
import { Monster } from '../../MonsterModule/types';
import { ApplyTargetSpellEffectEvent, SpellEngineEvents } from '../../SpellModule/Events';
import _ = require('lodash');

interface setupProps {
    monsterTemplates: Record<string, MonsterTemplate>
    playerAmount: number;
}

const setupEngine = ({ monsterTemplates, playerAmount }: RecursivePartial<setupProps> = {}) => {
    const calculatedPlayerAmount = playerAmount ?? 1;

    const randomGeneratorService = new RandomGeneratorService();
    (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(1);

    const monsterTemplateService = new MonsterTemplateService();
    (monsterTemplateService.getData as jest.Mock).mockReturnValue({ "1": Object.assign({}, MockedMonsterTemplates['1'], monsterTemplates ? monsterTemplates['1'] : {}) })

    const respawnService = new MonsterRespawnTemplateService();
    (respawnService.getData as jest.Mock).mockReturnValue(
        {
            'respawn_1': {
                id: 'respawn_1',
                location: { x: 150, y: 100 },
                templateId: "1",
                time: 4000,
                walkingType: WalkingType.None,
            },
        }
    );

    const engineManager = new EngineManager();

    const internalPlayers = {};

    for (let i = 0; i < calculatedPlayerAmount; i++) {
        internalPlayers[i + 1] = engineManager.preparePlayerWithCharacter({ name: 'character_' + i })
    }

    let initialDataPackage = engineManager.getLatestPlayerDataPackage(internalPlayers[calculatedPlayerAmount].socketId);

    engineManager.createSystemAction<MonsterRespawnsUpdatedEvent>({
        type: MonsterEngineEvents.MonsterRespawnsUpdated,
        respawnIds: ['respawn_1']
    });

    return { engineManager, players: internalPlayers, initialDataPackage };
};

describe('Power points service', () => {
    it('Player should be notified if he monster is beeing hit', () => {
        const { players, engineManager } = setupEngine({
            monsterTemplates: {
                '1': { sightRange: 200, desiredRange: 1, healthPoints: 100 },
            }
        });
        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        let [monster1]: Monster[] = _.filter(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

        const damageEffect: DamageEffect = {
            id: "1",
            type: SpellEffectType.Damage,
            amount: 100,
            spellId: "SPELL_ID",
            attribute: Attribute.Strength
        }

        engineManager.createSystemAction<ApplyTargetSpellEffectEvent>({
            type: SpellEngineEvents.ApplyTargetSpellEffect,
            caster: { id: players['1'].characterId } as Character,
            target: monster1,
            effect: damageEffect,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        checkIfPackageIsValid(GlobalStoreModule.CHARACTER_POWER_POINTS, dataPackage, {
            data: {
                monster_0: {
                    currentHp: 79,
                }
            },
            events: [
                {
                    id: '1',
                    type: CharacterClientEvents.CharacterLostHp,
                    amount: 21,
                    attackerId: "playerCharacter_1",
                    characterId: "monster_0",
                    spellId: "SPELL_ID"
                }
            ]
        });
    });

    it('Player should be notified when he heals another player', () => {
        const { players, engineManager } = setupEngine({
            playerAmount: 2,
            monsterTemplates: {
                '1': { sightRange: 200, desiredRange: 1, healthPoints: 100 },
            },
        });

        const damageEffect: DamageEffect = {
            id: '1',
            type: SpellEffectType.Damage,
            amount: 100,
            spellId: "SPELL_ID",
            attribute: Attribute.Strength
        }

        engineManager.createSystemAction<ApplyTargetSpellEffectEvent>({
            type: SpellEngineEvents.ApplyTargetSpellEffect,
            caster: { id: players['1'].characterId } as Character,
            target: { id: players['2'].characterId } as Character,
            effect: damageEffect,
        });

        const healingEffect: HealEffect = {
            id: "1",
            type: SpellEffectType.Heal,
            amount: 10,
            spellId: "SPELL_ID"
        };

        engineManager.createSystemAction<ApplyTargetSpellEffectEvent>({
            type: SpellEngineEvents.ApplyTargetSpellEffect,
            caster: { id: players['1'].characterId } as Character,
            target: { id: players['2'].characterId } as Character,
            effect: healingEffect,
        });

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        checkIfPackageIsValid(GlobalStoreModule.CHARACTER_POWER_POINTS, dataPackage, {
            data: {
                playerCharacter_2: {
                    currentHp: 189,
                }
            },
            events: [
                {
                    id: "2",
                    type: CharacterClientEvents.CharacterGotHp,
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
