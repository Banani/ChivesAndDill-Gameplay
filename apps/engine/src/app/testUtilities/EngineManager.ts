import { EngineAction, EngineClientAction, EnginePackage, PlayerClientActions, RecursivePartial, Spell } from '@bananos/types';
import { MainEngine } from '../engines/MainEngine';
import { MockedCharacterClasses, MockedItemTemplates, MockedMonsterTemplates, MockedNpcTemplates, MockedQuests, MockedSpells } from '../mocks';
import {
    getCharacterModule,
    getChatModule,
    getGroupModule,
    getItemModule,
    getMapModule,
    getMonsterModule,
    getNpcModule,
    getPlayerModule,
    getQuestModule,
    getSpellModule,
} from '../modules';
import { MonsterEngineEvents, MonsterRespawnsUpdatedEvent } from '../modules/MonsterModule/Events';
import { MonsterRespawnTemplateService } from '../modules/MonsterModule/services';
import { SpellService } from '../modules/SpellModule/services';
import { WalkingType } from '../types/CharacterRespawn';
import { PlayerCharacter } from '../types/PlayerCharacter';
import { EngineEvent } from '../types/events';
import _ = require('lodash');

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

jest.mock('../modules/QuestModule/services/QuestSchemasService', () => {
    const getData = jest.fn().mockReturnValue(MockedQuests);

    return {
        QuestSchemasService: function () {
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

    private players = {};
    private playerSocketIdIncrement = 0;
    private playerSockets = {};
    // socketId => action_name = callback
    private playerActionHandlers: Record<string, Partial<Record<EngineClientAction, (a?: any) => {}>>> = {};
    private allPlayerActionsHandler = {};

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
                getGroupModule()
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
                onAny: jest.fn().mockImplementation((callback) => {
                    // this.playerActionHandlers[id][action] = callback;
                    this.allPlayerActionsHandler[id] = callback;
                }),
            };

            this.ioHandler['connection'](this.playerSockets[id]);
            this.doEngineAction();

            return id.toString();
        }

        throw new Error('IO is not ready yet.');
    }

    callPlayerAction(playerId: string, action: EngineAction) {
        if (!this.playerActionHandlers[playerId]) {
            throw new Error('Unknown playerId: ' + playerId);
        }

        if (!this.playerActionHandlers[playerId][action.type]) {
            this.allPlayerActionsHandler[playerId](action.type, action);
            // throw new Error(`Action: [${action.type}] is not handled by Engine for playerId: [${playerId}]`);
        } else {
            this.playerActionHandlers[playerId][action.type](action);
        }

        this.doEngineAction();
        return this.getLatestPlayerDataPackage(playerId);
    }

    preparePlayerWithCharacter: (character: { name: string; characterClassId?: string }) => PlayerCharacterForTesting = (character) => {
        const id = this.addNewPlayer();
        this.callPlayerAction(id, { type: PlayerClientActions.CreatePlayerCharacter, characterClassId: '1', ...character });
        const dataPackage = this.getLatestPlayerDataPackage(id);

        this.players[id] = {
            socketId: id,
            character: dataPackage.character.data[dataPackage.activeCharacter.data.activeCharacterId],
            characterId: dataPackage.activeCharacter.data.activeCharacterId as unknown as PlayerCharacter,
        }

        return this.players[id];
    }

    getPlayers = () => this.players;

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

interface PrepareEngineManagerProps {
    monsterLocation: Location;
    spells: Record<string, Partial<Spell>>;
    amountOfPlayers: number;
    amountOfMonsters: number;
}

export const prepareEngineManager = ({ monsterLocation, spells, amountOfPlayers, amountOfMonsters }: RecursivePartial<PrepareEngineManagerProps> = {}) => {
    const spellService = new SpellService();
    (spellService.getData as jest.Mock).mockReturnValue(_.merge({}, MockedSpells, spells))

    const monsterRespawnService = new MonsterRespawnTemplateService();
    (monsterRespawnService.getData as jest.Mock).mockReturnValue(
        {
            'monster_respawn_1': {
                id: 'monster_respawn_1',
                location: monsterLocation ?? { x: 150, y: 100 },
                templateId: "1",
                time: 4000,
                walkingType: WalkingType.None,
            },
        }
    );

    const engineManager = new EngineManager();

    const calculatedAmountOfPlayers = amountOfPlayers ?? 1;
    const players = {};
    for (let i = 0; i < calculatedAmountOfPlayers; i++) {
        players[i + 1] = engineManager.preparePlayerWithCharacter({ name: 'character_' + (i + 1) })
    }

    engineManager.createSystemAction<MonsterRespawnsUpdatedEvent>({
        type: MonsterEngineEvents.MonsterRespawnsUpdated,
        respawnIds: _.range(amountOfMonsters ?? 1).map(() => 'monster_respawn_1')
    });

    const monsterDataPackage = engineManager.getLatestPlayerDataPackage(players[calculatedAmountOfPlayers].socketId);

    return { engineManager, players, monsterDataPackage };
};