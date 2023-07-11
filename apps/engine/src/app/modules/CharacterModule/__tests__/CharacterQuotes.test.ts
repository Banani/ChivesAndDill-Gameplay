import { GlobalStoreModule, RecursivePartial } from '@bananos/types';
import { EngineEvents } from 'apps/engine/src/app/EngineEvents';
import { EngineManager, checkIfPackageIsValid } from 'apps/engine/src/app/testUtilities';
import { CharacterDiedEvent, CharacterType } from 'apps/engine/src/app/types';
import { CharacterRespawn, WalkingType } from 'apps/engine/src/app/types/CharacterRespawn';
import { CharacterUnion } from 'apps/engine/src/app/types/CharacterUnion';
import { now } from 'lodash';
import { } from '../..';
import { MockedMonsterTemplates } from '../../../mocks';
import { RandomGeneratorService } from '../../../services/RandomGeneratorService';
import { MonsterEngineEvents, MonsterPulledEvent, MonsterRespawnsUpdatedEvent } from '../../MonsterModule/Events';
import { MonsterTemplate } from '../../MonsterModule/MonsterTemplates';
import { MonsterRespawnTemplateService, MonsterTemplateService } from '../../MonsterModule/services';
import { Monster } from '../../MonsterModule/types';
import _ = require('lodash');

interface CharacterQuotesProps {
    respawnServiceProps?: Record<string, CharacterRespawn>;
    monsterTemplate: Partial<MonsterTemplate>;
}

const setupEngine = ({ respawnServiceProps, monsterTemplate }: RecursivePartial<CharacterQuotesProps> = {}) => {
    const monsterTemplateService = new MonsterTemplateService();
    (monsterTemplateService.getData as jest.Mock).mockReturnValue({ "1": _.merge({}, MockedMonsterTemplates['1'], monsterTemplate) })

    const respawnService = new MonsterRespawnTemplateService();
    (respawnService.getData as jest.Mock).mockReturnValue(
        _.merge(
            {},
            {
                'respawn_1': {
                    id: 'respawn_1',
                    location: { x: 250, y: 200 },
                    characterTemplateId: "1",
                    time: 4000,
                    walkingType: WalkingType.None,
                },
            },
            respawnServiceProps
        )
    );

    const currentTime = '12221';
    (now as jest.Mock).mockReturnValue(currentTime);

    const randomGeneratorService = new RandomGeneratorService();
    (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(0);

    const engineManager = new EngineManager();

    const players = {
        '1': engineManager.preparePlayerWithCharacter({ name: 'character_1' }),
        '2': engineManager.preparePlayerWithCharacter({ name: 'character_2' }),
    };

    engineManager.createSystemAction<MonsterRespawnsUpdatedEvent>({
        type: MonsterEngineEvents.MonsterRespawnsUpdated,
        respawnIds: ['respawn_1']
    });

    return { engineManager, players, randomGeneratorService, currentTime };
};

describe('CharacterQuotes', () => {
    it('Monster should say a quote when dying, if random number is low enough', () => {
        const { engineManager, players, randomGeneratorService, currentTime } = setupEngine();
        (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(0);

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['2'].socketId);
        const monster: Monster = _.find(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

        const newCurrentTime = '992221';
        (now as jest.Mock).mockReturnValue(newCurrentTime);
        engineManager.createSystemAction<CharacterDiedEvent>({
            type: EngineEvents.CharacterDied,
            characterId: monster.id,
            killerId: players['1'].characterId,
            character: monster,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(GlobalStoreModule.CHAT_MESSAGES, dataPackage, {
            data: {
                chatQuoteMessage_1: {
                    authorId: 'monster_0',
                    channelType: 'Quotes',
                    id: 'chatQuoteMessage_1',
                    message: 'Tylko nie to...',
                    time: newCurrentTime,
                },
            },
        });
    });

    it('Monster should not say anything when dying, if random number is not low enough', () => {
        const { engineManager, players, randomGeneratorService } = setupEngine({
            monsterTemplate: {
                quotesEvents: {
                    onDying: { chance: 0.6, quotes: ["test"] }
                }
            }
        });
        (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(0.7);

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['2'].socketId);
        const monster: Monster = _.find(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

        const newCurrentTime = '992221';
        (now as jest.Mock).mockReturnValue(newCurrentTime);

        engineManager.createSystemAction<CharacterDiedEvent>({
            type: EngineEvents.CharacterDied,
            characterId: monster.id,
            killerId: players['1'].characterId,
            character: monster,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(GlobalStoreModule.CHAT_MESSAGES, dataPackage, undefined);
    });

    it('Monster should not say anything when dying, if monster does not have defined quotes', () => {
        const { engineManager, players, randomGeneratorService } = setupEngine({
            monsterTemplate: {
                quotesEvents: {
                    onDying: null
                }
            }
        });
        (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(0.8);

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['2'].socketId);
        const monster: Monster = _.find(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

        const newCurrentTime = '992221';
        (now as jest.Mock).mockReturnValue(newCurrentTime);
        engineManager.createSystemAction<CharacterDiedEvent>({
            type: EngineEvents.CharacterDied,
            characterId: monster.id,
            killerId: players['1'].characterId,
            character: monster,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(GlobalStoreModule.CHAT_MESSAGES, dataPackage, undefined);
    });

    it('Monster should say a quote when starting fight, if random number is low enough', () => {
        const { engineManager, players, randomGeneratorService, currentTime } = setupEngine();
        (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(0);

        const newCurrentTime = '992221';
        (now as jest.Mock).mockReturnValue(newCurrentTime);

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['2'].socketId);
        const monster: Monster = _.find(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

        engineManager.createSystemAction<MonsterPulledEvent>({
            type: MonsterEngineEvents.MonsterPulled,
            targetId: players['1'].characterId,
            monster,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(GlobalStoreModule.CHAT_MESSAGES, dataPackage, {
            data: {
                chatQuoteMessage_1: {
                    authorId: 'monster_0',
                    channelType: 'Quotes',
                    id: 'chatQuoteMessage_1',
                    message: 'Zgniotę Cie jak truskaweczke',
                    time: newCurrentTime,
                },
            },
        });
    });

    it('Monster should not say anything when starting fight, if monster does not have defined quotes', () => {
        const { engineManager, players, randomGeneratorService } = setupEngine({
            monsterTemplate: {
                quotesEvents: {
                    onPulling: null
                }
            }
        });
        (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(0.8);

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['2'].socketId);
        const monster: Monster = _.find(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

        engineManager.createSystemAction<MonsterPulledEvent>({
            type: MonsterEngineEvents.MonsterPulled,
            targetId: players['1'].characterId,
            monster,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(GlobalStoreModule.CHAT_MESSAGES, dataPackage, undefined);
    });

    it('Monster should not say a quote when starting fight, if random number is not high enough', () => {
        const { engineManager, players, randomGeneratorService } = setupEngine();
        (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(1);

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['2'].socketId);
        const monster: Monster = _.find(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

        engineManager.createSystemAction<MonsterPulledEvent>({
            type: MonsterEngineEvents.MonsterPulled,
            targetId: players['1'].characterId,
            monster,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(GlobalStoreModule.CHAT_MESSAGES, dataPackage, undefined);
    });

    it('Monster should not say a quote to often', () => {
        const { engineManager, players, randomGeneratorService } = setupEngine();
        (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(0.9);

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['2'].socketId);
        const monster: Monster = _.find(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

        engineManager.createSystemAction<MonsterPulledEvent>({
            type: MonsterEngineEvents.MonsterPulled,
            targetId: players['1'].characterId,
            monster,
        });

        engineManager.createSystemAction<CharacterDiedEvent>({
            type: EngineEvents.CharacterDied,
            characterId: monster.id,
            killerId: players['1'].characterId,
            character: monster,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(GlobalStoreModule.CHAT_MESSAGES, dataPackage, undefined);
    });

    it('Monster should say a quote if the number is high enough and enough time passed', () => {
        const { engineManager, players, randomGeneratorService, currentTime } = setupEngine();
        (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(0);

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['2'].socketId);
        const monster: Monster = _.find(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

        (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(0);
        engineManager.createSystemAction<MonsterPulledEvent>({
            type: MonsterEngineEvents.MonsterPulled,
            targetId: players['1'].characterId,
            monster,
        });

        const newCurrentTime = '992221';
        (now as jest.Mock).mockReturnValue(newCurrentTime);

        engineManager.createSystemAction<CharacterDiedEvent>({
            type: EngineEvents.CharacterDied,
            characterId: monster.id,
            killerId: players['1'].characterId,
            character: monster,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(GlobalStoreModule.CHAT_MESSAGES, dataPackage, {
            data: {
                chatQuoteMessage_1: {
                    authorId: 'monster_0',
                    channelType: 'Quotes',
                    id: 'chatQuoteMessage_1',
                    message: 'Tylko nie to...',
                    time: newCurrentTime,
                },
            },
        });
    });

    it('Monster should say a quote if killed a player', () => {
        const { engineManager, players, randomGeneratorService, currentTime } = setupEngine();

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['2'].socketId);
        const monster: Monster = _.find(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

        const newCurrentTime = '992221';
        (now as jest.Mock).mockReturnValue(newCurrentTime);
        engineManager.createSystemAction<CharacterDiedEvent>({
            type: EngineEvents.CharacterDied,
            characterId: players['1'].characterId,
            killerId: monster.id,
            character: players['1'].character,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['2'].socketId);

        checkIfPackageIsValid(GlobalStoreModule.CHAT_MESSAGES, dataPackage, {
            data: {
                chatQuoteMessage_1: {
                    authorId: 'monster_0',
                    channelType: 'Quotes',
                    id: 'chatQuoteMessage_1',
                    message: 'Pfff... ledwie go uderzyłem',
                    time: newCurrentTime,
                },
            },
        });
    });

    it('Monster should say a quote if he is just standing', () => {
        const { engineManager, players, randomGeneratorService, currentTime } = setupEngine();
        (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(0);

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['2'].socketId);

        checkIfPackageIsValid(GlobalStoreModule.CHAT_MESSAGES, dataPackage, {
            data: {
                chatQuoteMessage_0: {
                    authorId: 'monster_0',
                    channelType: 'Quotes',
                    id: 'chatQuoteMessage_0',
                    message: 'Zjadłbym zupe pomidorową Kamila, była super',
                    time: currentTime,
                },
            },
        });
    });

    it('Monster should not say a quote if he is just standing and to random number is to high', () => {
        const { engineManager, players, randomGeneratorService, currentTime } = setupEngine();
        (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(1);

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['2'].socketId);
        const monster: Monster = _.find(dataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

        engineManager.doEngineAction();

        dataPackage = engineManager.getLatestPlayerDataPackage(players['2'].socketId);

        checkIfPackageIsValid(GlobalStoreModule.CHAT_MESSAGES, dataPackage, undefined);
    });
});
