import { GlobalStoreModule, RecursivePartial } from '@bananos/types';
import { EngineManager, checkIfPackageIsValid } from 'apps/engine/src/app/testUtilities';
import { WalkingType } from 'apps/engine/src/app/types/CharacterRespawn';
import { MockedMonsterTemplates } from '../../../mocks';
import { RandomGeneratorService } from '../../../services/RandomGeneratorService';
import { MonsterEngineEvents, MonsterRespawnsUpdatedEvent } from '../../MonsterModule/Events';
import { MonsterTemplate } from '../../MonsterModule/MonsterTemplates';
import { MonsterRespawnTemplateService, MonsterTemplateService } from '../../MonsterModule/services';
import { killAnyMonster, openAnyCorpse } from "../testUtilities/Corpse";
import _ = require('lodash');

const setupEngine = ({ monsterTemplates }: RecursivePartial<{ monsterTemplates: Record<string, MonsterTemplate> }> = {}) => {
    const monsterTemplateService = new MonsterTemplateService();
    (monsterTemplateService.getData as jest.Mock).mockReturnValue({ '1': Object.assign({}, MockedMonsterTemplates['1'], monsterTemplates ? monsterTemplates['1'] : {}) })

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

    const randomGeneratorService = new RandomGeneratorService();
    (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(0.64);

    const engineManager = new EngineManager();

    const players = {
        '1': engineManager.preparePlayerWithCharacter({ name: 'character_1' }),
    };

    engineManager.createSystemAction<MonsterRespawnsUpdatedEvent>({
        type: MonsterEngineEvents.MonsterRespawnsUpdated,
        respawnIds: ['respawn_1']
    });

    return { engineManager, players, randomGeneratorService };
};

describe('CorpseDrop', () => {
    it('Player should be notified when items dropped', () => {
        const { engineManager, randomGeneratorService } = setupEngine();
        (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(0.5);

        const { dataPackage, monster } = killAnyMonster(engineManager, '1');

        checkIfPackageIsValid(GlobalStoreModule.CORPSE_DROP, dataPackage, { data: { monster_0: { location: monster.location, monsterTemplateId: '1' } } });
    });

    it('Player should not get notification about the loot if nothing dropped', () => {
        const { engineManager, randomGeneratorService } = setupEngine({
            monsterTemplates: {
                '1': {
                    dropSchema: {
                        coins: {
                            dropChance: 0,
                            maxAmount: 30,
                            minAmount: 0,
                        },
                        items: {}
                    }
                }
            }
        });
        (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(1);

        const { dataPackage } = killAnyMonster(engineManager, '1');

        checkIfPackageIsValid(GlobalStoreModule.CORPSE_DROP, dataPackage, undefined);
    });

    it('Corpse should drop items if random number is big enough', () => {
        const { engineManager, randomGeneratorService } = setupEngine();
        (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(0);

        killAnyMonster(engineManager, '1');
        const { dataPackage } = openAnyCorpse({ engineManager, playerId: '1' });

        checkIfPackageIsValid(GlobalStoreModule.ACTIVE_LOOT, dataPackage, {
            data: {
                monster_0: {
                    items: {
                        corpseItemId_1: {
                            amount: 1,
                            itemTemplateId: '1',
                        },
                        corpseItemId_2: {
                            amount: 1,
                            itemTemplateId: '2',
                        },
                    },
                },
            },
        });
    });

    it('Items with stack size 1, should be placed in another stack', () => {
        const { engineManager, randomGeneratorService } = setupEngine({
            monsterTemplates: {
                '1': {
                    dropSchema: {
                        items: {
                            '1': {
                                itemTemplateId: '1',
                                dropChance: 1,
                                maxAmount: 3,
                                minAmount: 3,
                            },
                            '2': {
                                itemTemplateId: '2',
                                dropChance: 1,
                                maxAmount: 1,
                                minAmount: 1,
                            },
                        }
                    }
                }
            }
        });
        (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(1);

        killAnyMonster(engineManager, '1');
        const { dataPackage } = openAnyCorpse({ engineManager, playerId: '1' });

        checkIfPackageIsValid(GlobalStoreModule.ACTIVE_LOOT, dataPackage, {
            data: {
                monster_0: {
                    items: {
                        corpseItemId_1: {
                            amount: 1,
                            itemTemplateId: '1',
                        },
                        corpseItemId_2: {
                            amount: 1,
                            itemTemplateId: '1',
                        },
                        corpseItemId_3: {
                            amount: 1,
                            itemTemplateId: '1',
                        },
                        corpseItemId_4: {
                            amount: 1,
                            itemTemplateId: '2',
                        },
                    },
                },
            },
        });
    });

    it('Item should be splited if amount is bigger then item stack size', () => {
        const { engineManager, randomGeneratorService } = setupEngine({
            monsterTemplates: {
                '1': {
                    dropSchema: {
                        items: {
                            '4': {
                                itemTemplateId: '4',
                                dropChance: 1,
                                maxAmount: 30,
                                minAmount: 30,
                            },
                        }
                    }
                }
            }
        });
        (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(1);

        killAnyMonster(engineManager, '1');
        const { dataPackage } = openAnyCorpse({ engineManager, playerId: '1' });

        checkIfPackageIsValid(GlobalStoreModule.ACTIVE_LOOT, dataPackage, {
            data: {
                monster_0: {
                    items: {
                        corpseItemId_1: {
                            amount: 20,
                            itemTemplateId: '4',
                        },
                        corpseItemId_2: {
                            amount: 10,
                            itemTemplateId: '4',
                        },
                    },
                },
            },
        });
    });
});
