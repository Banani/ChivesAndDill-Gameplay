import { EngineManager } from 'apps/engine/src/app/testUtilities';
import { MockedMonsterTemplates } from '../../../mocks';
import { WalkingType } from '../../../types/CharacterRespawn';
import { MonsterEngineEvents, MonsterRespawnsUpdatedEvent } from '../../MonsterModule/Events';
import { MonsterRespawnTemplateService } from '../../MonsterModule/services';
import _ = require('lodash');


const setupEngine = () => {
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

    const players = {
        '1': engineManager.preparePlayerWithCharacter({ name: 'character_1' }),
    };

    engineManager.createSystemAction<MonsterRespawnsUpdatedEvent>({
        type: MonsterEngineEvents.MonsterRespawnsUpdated,
        respawnIds: ['respawn_1']
    });

    let initialDataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

    return { engineManager, players, monsterTemplates: MockedMonsterTemplates, initialDataPackage };
};

describe('Spell Cast Time Notifier', () => {
    it.skip('Player should be notifier about the cooldown', () => {
        // const newCurrentTime = 992221;
        // (now as jest.Mock).mockReturnValue(newCurrentTime);

        // const { players, engineManager } = setupEngine();
        // let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        // const monster: Monster = _.find(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

        // engineManager.callPlayerAction(players['1'].socketId, {
        //     type: PlayerClientActions.CastSpell,
        //     directionLocation: { x: 150, y: 100 },
        //     spellId: '1',
        //     targetId: monster.id
        // })

        // dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        // checkIfPackageIsValid(GlobalStoreModule.SPELL_CAST_TIME, dataPackage, {
        //     data: {
        //         '1': 992221
        //     },
        // });
    });
});
