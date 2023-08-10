import { CharacterClientActions, GlobalStoreModule, Location, RecursivePartial } from '@bananos/types';
import { EngineManager, checkIfPackageIsValid } from 'apps/engine/src/app/testUtilities';
import { times } from 'lodash';
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
        }
    );

    const engineManager = new EngineManager();

    const players = {
        '1': engineManager.preparePlayerWithCharacter({ name: 'character_1' }),
    };

    engineManager.createSystemAction<MonsterRespawnsUpdatedEvent>({
        type: MonsterEngineEvents.MonsterRespawnsUpdated,
        respawnIds: ['respawn_1']
    });

    let initialDataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

    return { engineManager, players, monsterTemplates: calculatedMonsterTemplates, initialDataPackage };
};

describe('Aggro service', () => {
    it('Monster should go to character if he is in range', () => {
        const { players, engineManager, monsterTemplates } = setupEngine({ monsterTemplates: { '1': { sightRange: 250 } } });

        engineManager.doEngineAction();
        engineManager.doEngineAction();

        const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(GlobalStoreModule.CHARACTER_MOVEMENTS, dataPackage, {
            data: {
                monster_0: {
                    direction: 2,
                    isInMove: true,
                    location: {
                        x: 150 - monsterTemplates['1'].movementSpeed,
                        y: 100,
                    },
                },
            },
        });
    });

    it('Monster should not go to character if he is not in range', () => {
        const startingLocation = { x: 200, y: 100 };
        const { players, engineManager } = setupEngine({
            startingLocation,
            monsterTemplates: { '1': { sightRange: 100 } },
        });

        engineManager.doEngineAction();
        engineManager.doEngineAction();

        const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(GlobalStoreModule.CHARACTER_MOVEMENTS, dataPackage, {
            data: {
                monster_0: {
                    direction: 1,
                    isInMove: false,
                    location: startingLocation,
                },
            },
        });
    });

    it('Monster should go to player character if he came to his sight range', () => {
        const startingLocation = { x: 200, y: 100 };
        const { players, engineManager, monsterTemplates } = setupEngine({
            startingLocation,
            monsterTemplates: { '1': { sightRange: 100 } },
        });

        engineManager.callPlayerAction(players['1'].socketId, {
            type: CharacterClientActions.PlayerStartMove,
            x: 1,
            source: 'D',
        });

        times(12, () => {
            engineManager.doEngineAction();
        });

        engineManager.callPlayerAction(players['1'].socketId, {
            type: CharacterClientActions.PlayerStopMove,
            source: 'D',
        });

        engineManager.doEngineAction();

        const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(GlobalStoreModule.CHARACTER_MOVEMENTS, dataPackage, {
            data: {
                monster_0: {
                    direction: 3,
                    isInMove: true,
                    location: { y: 100, x: 270 },
                },
            },
        });
    });

    it('Monster should go back to his respawn when player character ran to far away', () => {
        const startingLocation = { x: 52, y: 100 };
        const { players, engineManager, monsterTemplates } = setupEngine({
            startingLocation,
            monsterTemplates: { '1': { sightRange: 2, movementSpeed: 1, desiredRange: 1 } },
        });

        engineManager.doEngineAction();

        engineManager.callPlayerAction(players['1'].socketId, {
            type: CharacterClientActions.PlayerStartMove,
            x: -1,
            source: 'D',
        });

        engineManager.doEngineAction();
        engineManager.doEngineAction();

        engineManager.callPlayerAction(players['1'].socketId, {
            type: CharacterClientActions.PlayerStopMove,
            source: 'D',
        });

        engineManager.doEngineAction();

        const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(GlobalStoreModule.CHARACTER_MOVEMENTS, dataPackage, {
            data: {
                monster_0: {
                    direction: 1,
                    isInMove: false,
                    location: startingLocation,
                },
            },
        });
    });

    it.skip('Monster should not go to character if he is in range but dead', () => {
        // const { players, engineManager, initialDataPackage } = setupEngine();

        // const monster: Monster = _.find(initialDataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

        // engineManager.createSystemAction<TakeCharacterHealthPointsEvent>({
        //     type: CharacterEngineEvents.TakeCharacterHealthPoints,
        //     attackerId: monster.id,
        //     characterId: players['1'].characterId,
        //     amount: 1000,
        //     spellId: "SPELL_ID"
        // });

        // engineManager.doEngineAction();
        // engineManager.doEngineAction();

        // const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        // checkIfPackageIsValid(GlobalStoreModule.CHARACTER_MOVEMENTS, dataPackage, {
        //     data: {
        //         monster_0: {
        //             direction: 1,
        //             isInMove: false,
        //             location: {
        //                 x: 150,
        //                 y: 100,
        //             },
        //         },
        //     },
        // });
    });

    it.skip('Monster should start chasing when is beeing hit by player character', () => {
        // const startingLocation = { x: 100, y: 100 };
        // const { players, engineManager } = setupEngine({
        //     startingLocation,
        //     monsterTemplates: { '1': { sightRange: 25, desiredRange: 1 } },
        // });
        // let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        // const monster: Monster = _.find(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

        // engineManager.createSystemAction<ApplyTargetSpellEffectEvent>({
        //     type: SpellEngineEvents.ApplyTargetSpellEffect,
        //     caster: { id: players['1'].characterId } as Character,
        //     target: monster,
        //     effect: {
        //         id: '1',
        //         type: SpellEffectType.Damage,
        //         amount: 10,
        //         attribute: Attribute.Strength,
        //         spellId: "SPELL_ID"
        //     },
        // });

        // engineManager.doEngineAction();
        // engineManager.doEngineAction();
        // engineManager.doEngineAction();

        // dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        // checkIfPackageIsValid(GlobalStoreModule.CHARACTER_MOVEMENTS, dataPackage, {
        //     data: {
        //         monster_0: {
        //             direction: 2,
        //             isInMove: true,
        //             location: {
        //                 x: 70,
        //                 y: 100,
        //             },
        //         },
        //     },
        // });
    });
});
