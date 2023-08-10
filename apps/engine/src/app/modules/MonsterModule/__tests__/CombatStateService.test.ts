import { GlobalStoreModule, Location, RecursivePartial } from '@bananos/types';
import { EngineManager, checkIfPackageIsValid } from 'apps/engine/src/app/testUtilities';
import { MockedMonsterTemplates } from '../../../mocks';
import { WalkingType } from '../../../types/CharacterRespawn';
import { MonsterEngineEvents, MonsterRespawnsUpdatedEvent } from '../Events';
import { MonsterTemplate } from '../MonsterTemplates';
import { MonsterRespawnTemplateService, MonsterTemplateService } from '../services';
import _ = require('lodash');


const setupEngine = ({ monsterTemplates, startingLocation }: RecursivePartial<{ monsterTemplates: Record<string, MonsterTemplate>, startingLocation: Location }> = {}) => {
    const monsterTemplateService = new MonsterTemplateService();
    const calculatedMonsterTemplates = { '1': Object.assign({}, MockedMonsterTemplates['1'], monsterTemplates ? monsterTemplates['1'] : {}) };
    (monsterTemplateService.getData as jest.Mock).mockReturnValue(calculatedMonsterTemplates)

    const respawnService = new MonsterRespawnTemplateService();
    (respawnService.getData as jest.Mock).mockReturnValue(
        {
            'respawn_1': {
                id: 'respawn_1',
                location: startingLocation ?? { x: 150, y: 100 },
                templateId: "1",
                time: 4000,
                walkingType: WalkingType.None,
            },
            'respawn_2': {
                id: 'respawn_2',
                location: startingLocation ?? { x: 150, y: 100 },
                templateId: "1",
                time: 4000,
                walkingType: WalkingType.None,
            },
        }
    );

    const engineManager = new EngineManager();

    const players = {
        '1': engineManager.preparePlayerWithCharacter({ name: 'character_1' }),
    };

    engineManager.createSystemAction<MonsterRespawnsUpdatedEvent>({
        type: MonsterEngineEvents.MonsterRespawnsUpdated,
        respawnIds: Object.keys(monsterTemplates).length == 1 ? ['respawn_1'] : ['respawn_1', 'respawn_2']
    });

    let initialDataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

    return { engineManager, players, monsterTemplates: calculatedMonsterTemplates, initialDataPackage };
};

describe('Combat state service', () => {
    it('Player should be in combat state when monster starts fight', () => {
        const { players, engineManager } = setupEngine({
            monsterTemplates: { '1': { sightRange: 300 } }
        });

        const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(GlobalStoreModule.COMBAT_STATE, dataPackage, {
            data: {
                monster_0: true,
                playerCharacter_1: true
            },
        });
    });

    it.skip('Player should not be in combat state if the monster is already dead', () => {
        // const startingLocation = { x: 100, y: 100 };
        // const { players, engineManager } = setupEngine({
        //     startingLocation,
        //     monsterTemplates: { '1': { sightRange: 200, desiredRange: 1, healthPoints: 100 } },
        // });
        // let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        // const monster: Monster = _.find(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

        // const damageEffect: DamageEffect = {
        //     id: "damage_id_123",
        //     type: SpellEffectType.Damage,
        //     amount: 1000,
        //     spellId: "SPELL_ID",
        //     attribute: Attribute.Strength
        // }

        // engineManager.createSystemAction<ApplyTargetSpellEffectEvent>({
        //     type: SpellEngineEvents.ApplyTargetSpellEffect,
        //     caster: { id: players['1'].characterId } as Character,
        //     target: monster,
        //     effect: damageEffect,
        // });

        // dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        // checkIfPackageIsValid(GlobalStoreModule.COMBAT_STATE, dataPackage, {
        //     data: {
        //         monster_0: false,
        //         playerCharacter_1: false
        //     },
        // });
    });

    it.skip('Player should be in combat if he is fighting two enemies, and he kills only one of them', () => {
        // const startingLocation = { x: 100, y: 100 };
        // const { players, engineManager } = setupEngine({
        //     startingLocation,
        //     monsterTemplates: {
        //         '1': { sightRange: 200, desiredRange: 1, healthPoints: 100 },
        //         '2': { sightRange: 200 }
        //     },
        // });
        // let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        // const monster: Monster = _.find(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

        // const damageEffect: DamageEffect = {
        //     id: "damage_id_123",
        //     type: SpellEffectType.Damage,
        //     amount: 200,
        //     spellId: "SPELL_ID",
        //     attribute: Attribute.Strength
        // }

        // engineManager.createSystemAction<ApplyTargetSpellEffectEvent>({
        //     type: SpellEngineEvents.ApplyTargetSpellEffect,
        //     caster: { id: players['1'].characterId } as Character,
        //     target: monster,
        //     effect: damageEffect,
        // });

        // dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        // checkIfPackageIsValid(GlobalStoreModule.COMBAT_STATE, dataPackage, undefined);
    });

    it.skip('Player should not be in combat if he kill all his enemies', () => {
        // const startingLocation = { x: 100, y: 100 };
        // const { players, engineManager } = setupEngine({
        //     startingLocation,
        //     monsterTemplates: {
        //         '1': { sightRange: 200, desiredRange: 1, healthPoints: 100 },
        //         '2': { sightRange: 200 }
        //     },
        // });
        // let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        // let [monster1, monster2]: Monster[] = _.filter(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

        // const damageEffect: DamageEffect = {
        //     id: "damage_id_123",
        //     type: SpellEffectType.Damage,
        //     amount: 1000,
        //     spellId: "SPELL_ID",
        //     attribute: Attribute.Strength
        // }

        // engineManager.createSystemAction<ApplyTargetSpellEffectEvent>({
        //     type: SpellEngineEvents.ApplyTargetSpellEffect,
        //     caster: { id: players['1'].characterId } as Character,
        //     target: monster1,
        //     effect: damageEffect,
        // });

        // engineManager.createSystemAction<ApplyTargetSpellEffectEvent>({
        //     type: SpellEngineEvents.ApplyTargetSpellEffect,
        //     caster: { id: players['1'].characterId } as Character,
        //     target: monster2,
        //     effect: damageEffect,
        // });

        // dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        // checkIfPackageIsValid(GlobalStoreModule.COMBAT_STATE, dataPackage, {
        //     data: {
        //         monster_1: false,
        //         playerCharacter_1: false
        //     }
        // });
    });
});
