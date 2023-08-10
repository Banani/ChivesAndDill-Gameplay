import { RecursivePartial } from '@bananos/types';
import { EngineManager } from 'apps/engine/src/app/testUtilities';
import { WalkingType } from 'apps/engine/src/app/types/CharacterRespawn';
import { MockedMonsterTemplates } from '../../../mocks';
import { RandomGeneratorService } from '../../../services/RandomGeneratorService';
import { MonsterEngineEvents, MonsterRespawnsUpdatedEvent } from '../../MonsterModule/Events';
import { MonsterTemplate } from '../../MonsterModule/MonsterTemplates';
import { MonsterRespawnTemplateService, MonsterTemplateService } from '../../MonsterModule/services';
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
        // const { engineManager, players, randomGeneratorService } = setupEngine();
        // (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(0.5);

        // let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        // const monster: Monster = _.find(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

        // engineManager.createSystemAction<CharacterDiedEvent>({
        //     type: EngineEvents.CharacterDied,
        //     characterId: monster.id,
        //     killerId: players['1'].characterId,
        //     character: monster,
        // });

        // dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        // checkIfPackageIsValid(GlobalStoreModule.CORPSE_DROP, dataPackage, { data: { monster_0: { location: monster.location, monsterTemplateId: '1' } } });
    });

    it('Player should not get notification about the loot if nothing dropped', () => {
        // const { engineManager, players, randomGeneratorService } = setupEngine({
        //     monsterTemplates: {
        //         '1': {
        //             dropSchema: {
        //                 coins: {
        //                     dropChance: 0,
        //                     maxAmount: 30,
        //                     minAmount: 0,
        //                 },
        //                 items: {}
        //             }
        //         }
        //     }
        // });
        // (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(1);

        // let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        // const monster: Monster = _.find(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

        // engineManager.createSystemAction<CharacterDiedEvent>({
        //     type: EngineEvents.CharacterDied,
        //     characterId: monster.id,
        //     killerId: players['1'].characterId,
        //     character: monster,
        // });

        // dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        // checkIfPackageIsValid(GlobalStoreModule.CORPSE_DROP, dataPackage, undefined);
    });

    it('corpse should drop items if random number is big enough', () => {
        // const { engineManager, players, randomGeneratorService } = setupEngine();
        // (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(0);

        // let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        // const monster: Monster = _.find(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

        // engineManager.createSystemAction<CharacterDiedEvent>({
        //     type: EngineEvents.CharacterDied,
        //     characterId: monster.id,
        //     killerId: players['1'].characterId,
        //     character: monster,
        // });

        // dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        // engineManager.callPlayerAction(players['1'].socketId, {
        //     type: PlayerClientActions.OpenLoot,
        //     corpseId: Object.keys(dataPackage.corpseDrop.data)[0],
        // });

        // dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        // checkIfPackageIsValid(GlobalStoreModule.ACTIVE_LOOT, dataPackage, {
        //     data: {
        //         monster_0: {
        //             items: {
        //                 corpseItemId_1: {
        //                     amount: 1,
        //                     itemTemplateId: '1',
        //                 },
        //                 corpseItemId_2: {
        //                     amount: 1,
        //                     itemTemplateId: '2',
        //                 },
        //             },
        //         },
        //     },
        // });
    });
});
