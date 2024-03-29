import { EngineManager } from 'apps/engine/src/app/testUtilities';
import { } from '../..';
import { MockedMonsterTemplates } from '../../../mocks';
import { RandomGeneratorService } from '../../../services/RandomGeneratorService';
import { WalkingType } from '../../../types/CharacterRespawn';
import { MonsterEngineEvents, MonsterRespawnsUpdatedEvent } from '../../MonsterModule/Events';
import { MonsterRespawnTemplateService, MonsterTemplateService } from '../../MonsterModule/services';
import _ = require('lodash');

const setupEngine = () => {
    const monsterTemplateService = new MonsterTemplateService();
    (monsterTemplateService.getData as jest.Mock).mockReturnValue(MockedMonsterTemplates)

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

describe('PlayerTriesToCloseLoot', () => {
    // Odwolujemy sie tutaj do wewnetrznego eventa, zamiast tego potwor powinien zostac zabity przez spell
    it.skip('active loot should be cleared when corpse is closed', () => {
        // const { engineManager, players } = setupEngine();

        // let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        // const monster: Monster = _.find(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

        // engineManager.createSystemAction<CharacterDiedEvent>({
        //     type: EngineEvents.CharacterDied,
        //     characterId: monster.id,
        //     killerId: players['1'].characterId,
        //     character: monster,
        // });

        // dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        // const corpseId = Object.keys(dataPackage.corpseDrop.data)[0];

        // engineManager.callPlayerAction(players['1'].socketId, {
        //     type: PlayerClientActions.OpenLoot,
        //     corpseId,
        // });

        // engineManager.callPlayerAction(players['1'].socketId, {
        //     type: PlayerClientActions.CloseLoot,
        // });

        // dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        // checkIfPackageIsValid(GlobalStoreModule.ACTIVE_LOOT, dataPackage, {
        //     toDelete: {
        //         monster_0: null,
        //     },
        // });
    });
});
