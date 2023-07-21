import { EngineEventType, GlobalStoreModule, SpellClientMessages } from '@bananos/types';
import { EngineManager, checkIfPackageIsValid } from 'apps/engine/src/app/testUtilities';
import { MockedMonsterTemplates, MockedSpells } from '../../../mocks';
import { RandomGeneratorService } from '../../../services/RandomGeneratorService';
import { CharacterType } from '../../../types';
import { WalkingType } from '../../../types/CharacterRespawn';
import { CharacterUnion } from '../../../types/CharacterUnion';
import { MonsterEngineEvents, MonsterRespawnsUpdatedEvent } from '../../MonsterModule/Events';
import { MonsterRespawnTemplateService, MonsterTemplateService } from '../../MonsterModule/services';
import { Monster } from '../../MonsterModule/types';
import { SpellService } from '../services';
import _ = require('lodash');


const setupEngine = () => {
    const spellService = new SpellService();
    (spellService.getData as jest.Mock).mockReturnValue(MockedSpells)

    const monsterTemplateService = new MonsterTemplateService();
    (monsterTemplateService.getData as jest.Mock).mockReturnValue(MockedMonsterTemplates)

    const randomGeneratorService = new RandomGeneratorService();
    (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(1);

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

describe('Spell availability service', () => {
    it('Player should be able to cast a spell if spell is assigned to his class', () => {
        const { players, engineManager } = setupEngine();
        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const monster: Monster = _.find(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

        engineManager.callPlayerAction(players['1'].socketId, {
            type: SpellClientMessages.CastSpell,
            directionLocation: { x: 150, y: 100 },
            spellId: '1',
            targetId: monster.id
        })

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(GlobalStoreModule.CHARACTER_POWER_POINTS, dataPackage, {
            data: {
                monster_0: {
                    currentHp: 79
                },
                playerCharacter_1: {
                    currentSpellPower: 0,
                }
            },
            events: [
                {
                    amount: 21,
                    characterId: "monster_0",
                    attackerId: 'playerCharacter_1',
                    spellId: '1',
                    type: EngineEventType.CharacterLostHp,
                },
            ],
        });
    });

    it('Player should not be able to cast a spell if the spell is not assigned to his class', () => {
        const { players, engineManager } = setupEngine();
        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const monster: Monster = _.find(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

        engineManager.callPlayerAction(players['1'].socketId, {
            type: SpellClientMessages.CastSpell,
            directionLocation: { x: 150, y: 100 },
            spellId: '2',
            targetId: monster.id
        })

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(GlobalStoreModule.CHARACTER_POWER_POINTS, dataPackage, undefined);
    });
});
