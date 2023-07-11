import { ClientMessages, CommonClientMessages, EnginePackage, EnginePackageActions } from '@bananos/types';
import { MainEngine } from '../engines/MainEngine';
import { MockedCharacterClasses, MockedItemTemplates, MockedMonsterTemplates, MockedNpcTemplates, MockedSpells } from '../mocks';
import {
    getCharacterModule,
    getChatModule,
    getItemModule,
    getMapModule,
    getMonsterModule,
    getNpcModule,
    getPlayerModule,
    getQuestModule,
    getSpellModule,
} from '../modules';
import { PlayerCharacter } from '../types/PlayerCharacter';
import { EngineEvent } from '../types/events';

jest.mock('lodash', () => ({
    ...(jest.requireActual('lodash') as any),
    now: jest.fn(),
}));

jest.mock('../services/RandomGeneratorService', () => {
    const generateNumber = jest.fn().mockReturnValue(1);

    return {
        RandomGeneratorService: function () {
            return {
                init: jest.fn(),
                handleEvent: jest.fn(),
                generateNumber,
            };
        },
    };
});

jest.mock('../services/DbService', () => ({
    DbService: jest.fn().mockImplementation(() => ({
        init: jest.fn(),
        handleEvent: jest.fn(),
    })),
}));

jest.mock('../modules/MapModule/services/MapService', () => ({
    MapService: jest.fn().mockImplementation(() => ({
        init: jest.fn(),
        handleEvent: jest.fn(),
        getData: jest.fn().mockReturnValue({}),
    })),
}));

jest.mock('../modules/PlayerModule/services/CharacterClassService', () => {
    const getData = jest.fn().mockReturnValue(MockedCharacterClasses);

    return {
        CharacterClassService: jest.fn().mockImplementation(() => ({
            init: jest.fn(),
            handleEvent: jest.fn(),
            getData,
        })),
    }
});

jest.mock('../modules/ItemModule/services/ItemTemplateService', () => {
    const getData = jest.fn().mockReturnValue(MockedItemTemplates);

    return {
        ItemTemplateService: jest.fn().mockImplementation(() => ({
            init: jest.fn(),
            handleEvent: jest.fn(),
            getData,
        })),
    }
});

jest.mock('../modules/MonsterModule/services/MonsterTemplateService', () => {
    const getData = jest.fn().mockReturnValue(MockedMonsterTemplates);

    return {
        MonsterTemplateService: jest.fn().mockImplementation(() => ({
            init: jest.fn(),
            handleEvent: jest.fn(),
            getData,
        })),
    }
});

jest.mock('../modules/MonsterModule/services/MonsterRespawnTemplateService', () => {
    const getData = jest.fn().mockReturnValue({});

    return {
        MonsterRespawnTemplateService: jest.fn().mockImplementation(() => ({
            init: jest.fn(),
            handleEvent: jest.fn(),
            getData,
        }))
    }
});

jest.mock('../modules/NpcModule/services/NpcTemplateService', () => {
    const getData = jest.fn().mockReturnValue(MockedNpcTemplates);

    return {
        NpcTemplateService: jest.fn().mockImplementation(() => ({
            init: jest.fn(),
            handleEvent: jest.fn(),
            getData,
        })),
    }
});

jest.mock('../modules/NpcModule/services/NpcRespawnTemplateService', () => {
    const getData = jest.fn().mockReturnValue({});

    return {
        NpcRespawnTemplateService: jest.fn().mockImplementation(() => ({
            init: jest.fn(),
            handleEvent: jest.fn(),
            getData,
        }))
    }
});

jest.mock('../modules/SpellModule/services/SpellService', () => {
    const getData = jest.fn().mockReturnValue(MockedSpells);

    return {
        SpellService: jest.fn().mockImplementation(() => ({
            init: jest.fn(),
            handleEvent: jest.fn(),
            getData,
        })),
    }
});

jest.mock('../modules/QuestModule/services/QuestTemplateService', () => {
    const getData = jest.fn();

    return {
        QuestTemplateService: function () {
            return {
                init: jest.fn(),
                handleEvent: jest.fn(),
                getData,
            };
        },
    };
});

export interface PlayerCharacterForTesting {
    socketId: string;
    character: PlayerCharacter;
    characterId: string;
}

export class EngineManager {
    private mainEngine: MainEngine;
    private ioHandler = {};
    private watchForErrors = false;

    private playerSocketIdIncrement = 0;
    private playerSockets = {};
    // socketId => action_name = callback
    private playerActionHandlers: Record<string, Partial<Record<ClientMessages, (a?: any) => {}>>> = {};

    constructor({ watchForErrors } = { watchForErrors: false }) {
        this.watchForErrors = watchForErrors;
        this.mainEngine = new MainEngine(
            {
                on: jest.fn().mockImplementation((event, callback) => {
                    this.ioHandler[event] = callback;
                }),
            },
            [
                getPlayerModule(),
                getCharacterModule(),
                getQuestModule(),
                getMonsterModule(),
                getSpellModule(),
                getMapModule(),
                getNpcModule(),
                getItemModule(),
                getChatModule(),
            ]
        );
    }

    doEngineAction() {
        this.mainEngine.doActions();
    }

    addNewPlayer(): string {
        if (this.ioHandler['connection']) {
            this.playerSocketIdIncrement++;
            const id = this.playerSocketIdIncrement;

            this.playerActionHandlers[id] = {};
            this.playerSockets[id] = {
                id,
                emit: jest.fn(),
                on: jest.fn().mockImplementation((action, callback) => {
                    this.playerActionHandlers[id][action] = callback;
                }),
            };

            this.ioHandler['connection'](this.playerSockets[id]);
            this.doEngineAction();

            return id.toString();
        }

        throw new Error('IO is not ready yet.');
    }

    callPlayerAction(playerId: string, action: EnginePackageActions) {
        if (!this.playerActionHandlers[playerId]) {
            throw new Error('Unknown playerId: ' + playerId);
        }

        if (!this.playerActionHandlers[playerId][action.type]) {
            throw new Error(`Action: [${action.type}] is not handled by Engine for playerId: [${playerId}]`);
        }

        this.playerActionHandlers[playerId][action.type](action);
        this.doEngineAction();
        return this.getLatestPlayerDataPackage(playerId);
    }

    preparePlayerWithCharacter: (character: { name: string; characterClassId?: string }) => PlayerCharacterForTesting = (character) => {
        const id = this.addNewPlayer();
        this.callPlayerAction(id, { type: CommonClientMessages.CreateCharacter, characterClassId: '1', ...character });
        const dataPackage = this.getLatestPlayerDataPackage(id);

        return {
            socketId: id,
            character: dataPackage.character.data[dataPackage.activeCharacter.data.activeCharacterId],
            characterId: dataPackage.activeCharacter.data.activeCharacterId,
        };
    }

    getLatestPlayerDataPackage(playerId: string): EnginePackage {
        if (!this.playerSockets[playerId]) {
            throw new Error('Unknown playerId: ' + playerId);
        }
        const calls = this.playerSockets[playerId].emit.mock.calls;
        const lastCall: EnginePackage = calls[calls.length - 1][1];

        if (this.watchForErrors && lastCall.errorMessages) {
            expect(lastCall.errorMessages.events).toStrictEqual([]);
        }

        return lastCall;
    }

    createSystemAction<T extends EngineEvent>(event: T) {
        this.mainEngine.createEvent<T>(event);
        this.mainEngine.doActions();
    }

    getNotifiers = () => this.mainEngine.getNotifiers();
}
