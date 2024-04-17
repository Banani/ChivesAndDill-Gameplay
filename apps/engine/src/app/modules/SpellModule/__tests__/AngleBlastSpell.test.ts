import { CharacterClientEvents, CharacterType, GlobalStoreModule, Location, RecursivePartial, Spell } from '@bananos/types';
import { EngineManager, checkIfPackageIsValid } from 'apps/engine/src/app/testUtilities';
import { MockedSpells } from '../../../mocks';
import { WalkingType } from '../../../types/CharacterRespawn';
import { CharacterUnion } from '../../../types/CharacterUnion';
import { MonsterEngineEvents, MonsterRespawnsUpdatedEvent } from '../../MonsterModule/Events';
import { MonsterRespawnTemplateService } from '../../MonsterModule/services';
import { NpcEngineEvents, NpcRespawnsUpdatedEvent } from '../../NpcModule/Events';
import { NpcRespawnTemplateService } from '../../NpcModule/services/NpcRespawnTemplateService';
import { Npc } from '../../NpcModule/types';
import { SpellService } from '../services';
import { attackMonster, castSpell } from "../testUtilities/Spell";
import _ = require('lodash');

interface SetupEngineProps {
    monsterLocation: Location;
    spells: Record<string, Partial<Spell>>;
    amountOfPlayers: number;
    amountOfMonsters: number;
}

const setupEngine = ({ monsterLocation, spells, amountOfPlayers, amountOfMonsters }: RecursivePartial<SetupEngineProps> = {}) => {
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

    const npcRespawnService = new NpcRespawnTemplateService();
    (npcRespawnService.getData as jest.Mock).mockReturnValue({
        'npc_respawn_1': {
            id: 'npc_respawn_1',
            location: { x: 100, y: 100 },
            templateId: "1",
            time: 4000,
            walkingType: WalkingType.None,
        },
    });


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

    engineManager.createSystemAction<NpcRespawnsUpdatedEvent>({
        type: NpcEngineEvents.NpcRespawnsUpdated,
        respawnIds: ['npc_respawn_1']
    });

    const npcDataPackage = engineManager.getLatestPlayerDataPackage(players[calculatedAmountOfPlayers].socketId);

    return { engineManager, npcDataPackage, players, monsterDataPackage };
};

describe('Angle blast spell', () => {
    it('Monster should be hit by angle blast spell', () => {
        const { engineManager, monsterDataPackage } = setupEngine();

        const monsterIds = Object.keys(monsterDataPackage.character.data);

        const { dataPackage } = attackMonster({
            engineManager,
            playerId: '1',
            spellId: '4',
            monsterId: monsterIds[0],
            location: monsterDataPackage.characterMovements.data[monsterIds[0]].location
        })

        checkIfPackageIsValid(GlobalStoreModule.CHARACTER_POWER_POINTS, dataPackage, {
            data: {
                monster_0: {
                    currentHp: 79,
                },
                playerCharacter_1: {
                    currentSpellPower: 0,
                },
            },
            events: [
                {
                    id: "1",
                    amount: 21,
                    attackerId: "playerCharacter_1",
                    characterId: "monster_0",
                    location: { x: 150, y: 100 },
                    spellId: "4",
                    type: CharacterClientEvents.CharacterLostHp,
                },
            ]
        });
    });

    it('Monster should not be hit if spell configuration says to omit it', () => {
        const { engineManager, monsterDataPackage } = setupEngine({ spells: { '4': { monstersImpact: false } } });

        const monsterIds = Object.keys(monsterDataPackage.character.data);

        const { dataPackage } = attackMonster({
            engineManager,
            playerId: '1',
            spellId: '4',
            monsterId: monsterIds[0],
            location: monsterDataPackage.characterMovements.data[monsterIds[0]].location
        })

        checkIfPackageIsValid(GlobalStoreModule.CHARACTER_POWER_POINTS, dataPackage, {
            data: {
                playerCharacter_1: {
                    currentSpellPower: 0,
                },
            },
        });
    });

    it("Effect should be spread between targets if spread effect is set to true", () => {
        const { engineManager, monsterDataPackage } = setupEngine({ amountOfMonsters: 2 });

        const monsterIds = Object.keys(monsterDataPackage.character.data);

        const { dataPackage } = attackMonster({
            engineManager,
            playerId: '1',
            spellId: '4',
            monsterId: monsterIds[0],
            location: monsterDataPackage.characterMovements.data[monsterIds[0]].location
        })

        checkIfPackageIsValid(GlobalStoreModule.CHARACTER_POWER_POINTS, dataPackage, {
            data: {
                monster_0: {
                    currentHp: 89,
                },
                monster_1: {
                    currentHp: 89,
                },
                playerCharacter_1: {
                    currentSpellPower: 0,
                },
            },
            events: [
                {
                    id: "1",
                    amount: 11,
                    attackerId: "playerCharacter_1",
                    characterId: "monster_0",
                    location: { x: 150, y: 100 },
                    spellId: "4",
                    type: CharacterClientEvents.CharacterLostHp,
                },
                {
                    id: "2",
                    amount: 11,
                    attackerId: "playerCharacter_1",
                    characterId: "monster_1",
                    location: { x: 150, y: 100 },
                    spellId: "4",
                    type: CharacterClientEvents.CharacterLostHp,
                },
            ]
        });
    });

    it("Effect should not be spread between targets if spread effect is set to false", () => {
        const { engineManager, monsterDataPackage } = setupEngine({ amountOfMonsters: 2, spells: { '4': { effectSpread: false } } });

        const monsterIds = Object.keys(monsterDataPackage.character.data);

        const { dataPackage } = attackMonster({
            engineManager,
            playerId: '1',
            spellId: '4',
            monsterId: monsterIds[0],
            location: monsterDataPackage.characterMovements.data[monsterIds[0]].location
        })

        checkIfPackageIsValid(GlobalStoreModule.CHARACTER_POWER_POINTS, dataPackage, {
            data: {
                monster_0: {
                    currentHp: 79,
                },
                monster_1: {
                    currentHp: 79,
                },
                playerCharacter_1: {
                    currentSpellPower: 0,
                },
            },
            events: [
                {
                    id: "1",
                    amount: 21,
                    attackerId: "playerCharacter_1",
                    characterId: "monster_0",
                    location: { x: 150, y: 100 },
                    spellId: "4",
                    type: CharacterClientEvents.CharacterLostHp,
                },
                {
                    id: "2",
                    amount: 21,
                    attackerId: "playerCharacter_1",
                    characterId: "monster_1",
                    location: { x: 150, y: 100 },
                    spellId: "4",
                    type: CharacterClientEvents.CharacterLostHp,
                },
            ]
        });
    });

    it("Target should not be hit if spell is called at different direction", () => {
        const { engineManager } = setupEngine();

        const { dataPackage } = castSpell({
            engineManager,
            playerId: '1',
            directionLocation: { x: 0, y: 0 },
            targetId: undefined,
            spellId: '4'
        })

        checkIfPackageIsValid(GlobalStoreModule.CHARACTER_POWER_POINTS, dataPackage, {
            data: {
                playerCharacter_1: {
                    currentSpellPower: 0,
                },
            },
        });
    });

    it('Monster should not be hit by angle blast spell if he is out of range', () => {
        const { engineManager, monsterDataPackage } = setupEngine({ spells: { "4": { range: 10 } } });

        const monsterIds = Object.keys(monsterDataPackage.character.data);

        const { dataPackage } = attackMonster({
            engineManager,
            playerId: '1',
            spellId: '4',
            monsterId: monsterIds[0],
            location: monsterDataPackage.characterMovements.data[monsterIds[0]].location
        })

        checkIfPackageIsValid(GlobalStoreModule.CHARACTER_POWER_POINTS, dataPackage, {
            data: {
                playerCharacter_1: {
                    currentSpellPower: 0,
                },
            },
        });
    });

    it('Player casting spell, casterImpact = yes => damage', () => {
        const { engineManager } = setupEngine({ spells: { "4": { casterImpact: true } } });

        const { dataPackage } = castSpell({
            engineManager,
            playerId: '1',
            directionLocation: { x: -150, y: -100 },
            spellId: '4'
        })

        checkIfPackageIsValid(GlobalStoreModule.CHARACTER_POWER_POINTS, dataPackage, {
            data: {
                playerCharacter_1: {
                    currentSpellPower: 0,
                    currentHp: 179,
                },
            },
            events: [
                {
                    id: "1",
                    amount: 21,
                    attackerId: "playerCharacter_1",
                    characterId: "playerCharacter_1",
                    location: { x: 50, y: 100 },
                    spellId: "4",
                    type: CharacterClientEvents.CharacterLostHp,
                },
            ]
        });
    })

    it('Player casting spell, casterImpact = no => no damage', () => {
        const { engineManager } = setupEngine({ spells: { "4": { casterImpact: false } } });

        const { dataPackage } = castSpell({
            engineManager,
            playerId: '1',
            directionLocation: { x: -150, y: -100 },
            spellId: '4'
        })

        checkIfPackageIsValid(GlobalStoreModule.CHARACTER_POWER_POINTS, dataPackage, {
            data: {
                playerCharacter_1: {
                    currentSpellPower: 0,
                },
            }
        });
    })

    it('Player casting spell at different player, playersImpact = yes => damage', () => {
        const { players, engineManager } = setupEngine({
            amountOfMonsters: 0,
            amountOfPlayers: 2,
            spells: {
                '4': {
                    playersImpact: true
                }
            }
        });

        castSpell({
            engineManager,
            playerId: '1',
            directionLocation: players['2'].character.location,
            spellId: '4'
        })

        const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(GlobalStoreModule.CHARACTER_POWER_POINTS, dataPackage, {
            data: {
                playerCharacter_1: {
                    currentSpellPower: 0,
                },
                playerCharacter_2: {
                    currentHp: 179,
                },
            },
            events: [
                {
                    id: "1",
                    amount: 21,
                    attackerId: "playerCharacter_1",
                    characterId: "playerCharacter_2",
                    location: { x: 50, y: 100 },
                    spellId: "4",
                    type: CharacterClientEvents.CharacterLostHp,
                },
            ]
        });
    })

    it('Player casting spell at different player, playersImpact = no => no damage', () => {
        const { players, engineManager } = setupEngine({
            amountOfMonsters: 0,
            amountOfPlayers: 2,
            spells: {
                '4': {
                    playersImpact: false
                }
            }
        });

        castSpell({
            engineManager,
            playerId: '1',
            directionLocation: players['2'].character.location,
            spellId: '4'
        })

        const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(GlobalStoreModule.CHARACTER_POWER_POINTS, dataPackage, {
            data: {
                playerCharacter_1: {
                    currentSpellPower: 0,
                },
            }
        });
    })

    it('Player should not be able to hit npc', () => {
        const { players, engineManager, npcDataPackage } = setupEngine({ amountOfMonsters: 0 });
        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const npc = _.find(npcDataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Npc) as Npc;

        castSpell({
            engineManager,
            playerId: '1',
            directionLocation: npc.location,
            spellId: '4'
        })

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(GlobalStoreModule.CHARACTER_POWER_POINTS, dataPackage, {
            data: {
                playerCharacter_1: {
                    currentSpellPower: 0,
                },
            }
        });
    })
});
