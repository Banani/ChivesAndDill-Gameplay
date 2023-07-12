import { CommonClientMessages, GlobalStoreModule } from '@bananos/types';
import { EngineEvents } from 'apps/engine/src/app/EngineEvents';
import { EngineManager, checkIfPackageIsValid } from 'apps/engine/src/app/testUtilities';
import { CharacterDiedEvent, CharacterType } from 'apps/engine/src/app/types';
import { WalkingType } from 'apps/engine/src/app/types/CharacterRespawn';
import { CharacterUnion } from 'apps/engine/src/app/types/CharacterUnion';
import { } from '..';
import { MockedMonsterTemplates } from '../../../mocks';
import { RandomGeneratorService } from '../../../services/RandomGeneratorService';
import { MonsterEngineEvents, MonsterRespawnsUpdatedEvent } from '../../MonsterModule/Events';
import { MonsterRespawnTemplateService, MonsterTemplateService } from '../../MonsterModule/services';
import { Monster } from '../../MonsterModule/types';
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
                characterTemplateId: "1",
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
        '2': engineManager.preparePlayerWithCharacter({ name: 'character_2' }),
        '3': engineManager.preparePlayerWithCharacter({ name: 'character_3' }),
    };

    engineManager.createSystemAction<MonsterRespawnsUpdatedEvent>({
        type: MonsterEngineEvents.MonsterRespawnsUpdated,
        respawnIds: ['respawn_1']
    });

    return { engineManager, players, randomGeneratorService };
};

describe('TakingAllItemFromCorpse', () => {
    it('Corpse should be removed when everything is collected from it and available corpse drop should be removed', () => {
        const { engineManager, players, randomGeneratorService } = setupEngine();
        (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(0.6);

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['3'].socketId);
        const monster: Monster = _.find(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

        engineManager.createSystemAction<CharacterDiedEvent>({
            type: EngineEvents.CharacterDied,
            characterId: monster.id,
            killerId: players['1'].characterId,
            character: monster,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const corpseId = Object.keys(dataPackage.corpseDrop.data)[0];

        engineManager.callPlayerAction(players['1'].socketId, {
            type: CommonClientMessages.OpenLoot,
            corpseId,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        const itemId1 = Object.keys(dataPackage.activeLoot.data[corpseId].items)[0];
        const itemId2 = Object.keys(dataPackage.activeLoot.data[corpseId].items)[1];

        engineManager.callPlayerAction(players['2'].socketId, {
            type: CommonClientMessages.OpenLoot,
            corpseId,
        });

        engineManager.callPlayerAction(players['1'].socketId, {
            type: CommonClientMessages.PickItemFromCorpse,
            corpseId,
            itemId: itemId1,
        });

        engineManager.callPlayerAction(players['1'].socketId, {
            type: CommonClientMessages.PickItemFromCorpse,
            corpseId,
            itemId: itemId2,
        });

        engineManager.callPlayerAction(players['1'].socketId, {
            type: CommonClientMessages.PickCoinsFromCorpse,
            corpseId,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['2'].socketId);

        checkIfPackageIsValid(GlobalStoreModule.ACTIVE_LOOT, dataPackage, { toDelete: { monster_0: null } });
        checkIfPackageIsValid(GlobalStoreModule.CORPSE_DROP, dataPackage, { toDelete: { monster_0: null } });
    });
});
