import { GlobalStoreModule, Location, PlayerClientActions, RecursivePartial } from '@bananos/types';
import { EngineManager, checkIfErrorWasHandled, checkIfPackageIsValid } from 'apps/engine/src/app/testUtilities';
import { } from '../../';
import { EngineEvents } from '../../../EngineEvents';
import { MockedMonsterTemplates } from '../../../mocks';
import { RandomGeneratorService } from '../../../services/RandomGeneratorService';
import { CharacterDiedEvent, CharacterType } from '../../../types';
import { WalkingType } from '../../../types/CharacterRespawn';
import { CharacterUnion } from '../../../types/CharacterUnion';
import { MonsterEngineEvents, MonsterRespawnsUpdatedEvent } from '../../MonsterModule/Events';
import { MonsterRespawnTemplateService, MonsterTemplateService } from '../../MonsterModule/services';
import { Monster } from '../../MonsterModule/types';
import _ = require('lodash');

interface SetupProps {
    monsterLocation: Location;
}

const setupEngine = (setupProps: RecursivePartial<SetupProps> = {}) => {
    const monsterTemplateService = new MonsterTemplateService();
    (monsterTemplateService.getData as jest.Mock).mockReturnValue(MockedMonsterTemplates)

    const respawnService = new MonsterRespawnTemplateService();
    (respawnService.getData as jest.Mock).mockReturnValue(
        {
            'respawn_1': {
                id: 'respawn_1',
                location: setupProps.monsterLocation ?? { x: 300, y: 400 },
                templateId: "1",
                time: 4000,
                walkingType: WalkingType.None,
            },
            'respawn_2': {
                id: 'respawn_2',
                location: setupProps.monsterLocation ?? { x: 350, y: 400 },
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
        respawnIds: ['respawn_1', "respawn_2"]
    });

    return { engineManager, players, randomGeneratorService };
};

describe('PlayerTriesToOpenLoot', () => {
    it('Player should be able to open corpse', () => {
        const { engineManager, players } = setupEngine({ monsterLocation: { x: 150, y: 100 } });

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const monster: Monster = _.find(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

        engineManager.createSystemAction<CharacterDiedEvent>({
            type: EngineEvents.CharacterDied,
            characterId: monster.id,
            killerId: players['1'].characterId,
            character: monster,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        engineManager.callPlayerAction(players['1'].socketId, {
            type: PlayerClientActions.OpenLoot,
            corpseId: Object.keys(dataPackage.corpseDrop.data)[0],
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(GlobalStoreModule.ACTIVE_LOOT, dataPackage, {
            data: {
                monster_0: {
                    coins: 19,
                    items: {
                        corpseItemId_1: {
                            amount: 1,
                            itemTemplateId: '1',
                        },
                        corpseItemId_2: {
                            amount: 1,
                            itemTemplateId: "2",
                        }
                    },
                },
            },
        });
    });

    it('Player should get error if tries to open corpse that does not exist', () => {
        const { engineManager, players } = setupEngine();

        engineManager.callPlayerAction(players['1'].socketId, {
            type: PlayerClientActions.OpenLoot,
            corpseId: 'Some_random_id',
        });

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfErrorWasHandled(GlobalStoreModule.ACTIVE_LOOT, 'This corpse does not exist.', dataPackage);
    });

    it('Player should get error if tries to open corpse that is to far away', () => {
        const { engineManager, players } = setupEngine({ monsterLocation: { x: 500, y: 500 } });

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const monster: Monster = _.find(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

        engineManager.createSystemAction<CharacterDiedEvent>({
            type: EngineEvents.CharacterDied,
            characterId: monster.id,
            killerId: players['1'].characterId,
            character: monster,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        engineManager.callPlayerAction(players['1'].socketId, {
            type: PlayerClientActions.OpenLoot,
            corpseId: Object.keys(dataPackage.corpseDrop.data)[0],
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfErrorWasHandled(GlobalStoreModule.ACTIVE_LOOT, 'This corpse is to far away.', dataPackage);
    });

    it('Player should have current loot closed it tries to open another one', () => {
        const { engineManager, players } = setupEngine({ monsterLocation: { x: 150, y: 100 } });

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const monster: Monster[] = _.filter(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

        engineManager.createSystemAction<CharacterDiedEvent>({
            type: EngineEvents.CharacterDied,
            characterId: monster[0].id,
            killerId: players['1'].characterId,
            character: monster[0],
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        engineManager.callPlayerAction(players['1'].socketId, {
            type: PlayerClientActions.OpenLoot,
            corpseId: Object.keys(dataPackage.corpseDrop.data)[0],
        });

        engineManager.createSystemAction<CharacterDiedEvent>({
            type: EngineEvents.CharacterDied,
            characterId: monster[1].id,
            killerId: players['1'].characterId,
            character: monster[1],
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        engineManager.callPlayerAction(players['1'].socketId, {
            type: PlayerClientActions.OpenLoot,
            corpseId: Object.keys(dataPackage.corpseDrop.data)[0],
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(GlobalStoreModule.ACTIVE_LOOT, dataPackage, {
            data: {
                monster_1: {
                    coins: 19,
                    items: {
                        corpseItemId_3: {
                            amount: 1,
                            itemTemplateId: '1',
                        },
                        corpseItemId_4: {
                            amount: 1,
                            itemTemplateId: '2',
                        }
                    },
                },
            },
            toDelete: {
                monster_0: null,
            },
        });
    });
});
