import { CharacterClientEvents, DirectInstantSpell, GlobalStoreModule, Location, RecursivePartial, SpellClientActions } from '@bananos/types';
import { EngineManager, checkIfErrorWasHandled, checkIfPackageIsValid } from 'apps/engine/src/app/testUtilities';
import { MockedMonsterTemplates, MockedSpells } from '../../../mocks';
import { WalkingType } from '../../../types/CharacterRespawn';
import { MonsterEngineEvents, MonsterRespawnsUpdatedEvent } from '../../MonsterModule/Events';
import { MonsterRespawnTemplateService } from '../../MonsterModule/services';
import { NpcEngineEvents, NpcRespawnsUpdatedEvent } from '../../NpcModule/Events';
import { NpcRespawnTemplateService } from '../../NpcModule/services/NpcRespawnTemplateService';
import { SpellService } from '../services';
import _ = require('lodash');

interface SetupEngineProps {
    monsterLocation: Location;
    spell: Partial<DirectInstantSpell>;
    amountOfPlayers: number;
}

const setupEngine = ({ monsterLocation, spell, amountOfPlayers }: RecursivePartial<SetupEngineProps> = {}) => {
    const spellService = new SpellService();
    (spellService.getData as jest.Mock).mockReturnValue({ '1': _.merge({}, MockedSpells['1'], spell) })

    const respawnService = new MonsterRespawnTemplateService();
    (respawnService.getData as jest.Mock).mockReturnValue(
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
        respawnIds: ['monster_respawn_1']
    });

    const monsterDataPackage = engineManager.getLatestPlayerDataPackage(players[calculatedAmountOfPlayers].socketId);

    engineManager.createSystemAction<NpcRespawnsUpdatedEvent>({
        type: NpcEngineEvents.NpcRespawnsUpdated,
        respawnIds: ['npc_respawn_1']
    });

    const npcDataPackage = engineManager.getLatestPlayerDataPackage(players[calculatedAmountOfPlayers].socketId);

    return { engineManager, players, monsterTemplates: MockedMonsterTemplates, monsterDataPackage, npcDataPackage };
};

describe('Direct instant spell', () => {
    it.skip('Monster should be hit by direct instant spell', () => {
        // const { players, engineManager, monsterDataPackage } = setupEngine();
        // const monster: Monster = _.find(monsterDataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

        // engineManager.callPlayerAction(players['1'].socketId, {
        //     type: PlayerClientActions.CastSpell,
        //     directionLocation: monster.location,
        //     spellId: '1',
        //     targetId: monster.id
        // })

        // const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        // checkIfPackageIsValid(GlobalStoreModule.CHARACTER_POWER_POINTS, dataPackage, {
        //     data: {
        //         monster_0: {
        //             "currentHp": 79,
        //         },
        //         playerCharacter_1: {
        //             "currentSpellPower": 0,
        //         },
        //     },
        //     events: [
        //         {
        //             id: "1",
        //             amount: 21,
        //             attackerId: "playerCharacter_1",
        //             characterId: "monster_0",
        //             spellId: "1",
        //             type: CharacterClientEvents.CharacterLostHp,
        //         },
        //     ]
        // });
    });

    it('Player should not be able to use spell if does not have a target', () => {
        // const { players, engineManager, monsterDataPackage } = setupEngine({ monsterLocation: { x: 1000, y: 1000 } });
        // const monster: Monster = _.find(monsterDataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

        // engineManager.callPlayerAction(players['1'].socketId, {
        //     type: PlayerClientActions.CastSpell,
        //     directionLocation: monster.location,
        //     spellId: '1',
        //     targetId: null
        // })

        // const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        // checkIfErrorWasHandled(GlobalStoreModule.CHARACTER_POWER_POINTS, "You don't have a target.", dataPackage);
    });

    it('Monster should not be hit if he is out of range', () => {
        // const { players, engineManager, monsterDataPackage } = setupEngine({ monsterLocation: { x: 1000, y: 1000 } });
        // const monster: Monster = _.find(monsterDataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

        // engineManager.callPlayerAction(players['1'].socketId, {
        //     type: PlayerClientActions.CastSpell,
        //     directionLocation: monster.location,
        //     spellId: '1',
        //     targetId: monster.id
        // })

        // const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        // checkIfErrorWasHandled(GlobalStoreModule.CHARACTER_POWER_POINTS, 'Out of range.', dataPackage);
    });

    it('Monster should not be hit if spell configuration says to omit it', () => {
        // const { players, engineManager, monsterDataPackage } = setupEngine({ spell: { monstersImpact: false } });
        // const monster: Monster = _.find(monsterDataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Monster);

        // engineManager.callPlayerAction(players['1'].socketId, {
        //     type: PlayerClientActions.CastSpell,
        //     directionLocation: monster.location,
        //     spellId: '1',
        //     targetId: monster.id
        // })

        // const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        // checkIfErrorWasHandled(GlobalStoreModule.CHARACTER_POWER_POINTS, 'Invalid target.', dataPackage);
    });

    it('Player casting spell, casterImpact = yes => damage', () => {
        const { players, engineManager } = setupEngine({ spell: { casterImpact: true } });
        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        engineManager.callPlayerAction(players['1'].socketId, {
            type: SpellClientActions.CastSpell,
            directionLocation: players['1'].character.location,
            spellId: '1',
            targetId: players['1'].character.id
        })

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        checkIfPackageIsValid(GlobalStoreModule.CHARACTER_POWER_POINTS, dataPackage, {
            data: {
                playerCharacter_1: {
                    "currentHp": 179,
                    "currentSpellPower": 0,
                },
            },
            events: [
                {
                    id: "1",
                    amount: 21,
                    attackerId: "playerCharacter_1",
                    characterId: "playerCharacter_1",
                    spellId: "1",
                    type: CharacterClientEvents.CharacterLostHp,
                },
            ]
        });
    });

    it('player casting spell, casterImpact = no => error message', () => {
        const { players, engineManager } = setupEngine({ spell: { casterImpact: false } });

        engineManager.callPlayerAction(players['1'].socketId, {
            type: SpellClientActions.CastSpell,
            directionLocation: players['1'].character.location,
            spellId: '1',
            targetId: players['1'].character.id
        })

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        checkIfErrorWasHandled(GlobalStoreModule.CHARACTER_POWER_POINTS, 'Invalid target.', dataPackage);
    });

    it('Player casting spell at different player, playersImpact = yes => damage', () => {
        const { players, engineManager } = setupEngine({ spell: { casterImpact: false, playersImpact: true }, amountOfPlayers: 2 });
        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        engineManager.callPlayerAction(players['1'].socketId, {
            type: SpellClientActions.CastSpell,
            directionLocation: players['2'].character.location,
            spellId: '1',
            targetId: players['2'].character.id
        })

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        checkIfPackageIsValid(GlobalStoreModule.CHARACTER_POWER_POINTS, dataPackage, {
            data: {
                playerCharacter_1: {
                    "currentSpellPower": 0,
                },
                playerCharacter_2: {
                    "currentHp": 179,
                }
            },
            events: [
                {
                    id: "1",
                    amount: 21,
                    attackerId: "playerCharacter_1",
                    characterId: "playerCharacter_2",
                    spellId: "1",
                    type: CharacterClientEvents.CharacterLostHp,
                },
            ]
        });
    });

    it('Player casting spell at different player, playersImpact = no => no damage', () => {
        const { players, engineManager } = setupEngine({ spell: { casterImpact: false, playersImpact: false }, amountOfPlayers: 2 });
        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        engineManager.callPlayerAction(players['1'].socketId, {
            type: SpellClientActions.CastSpell,
            directionLocation: players['2'].character.location,
            spellId: '1',
            targetId: players['2'].character.id
        })

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        checkIfErrorWasHandled(GlobalStoreModule.CHARACTER_POWER_POINTS, 'Invalid target.', dataPackage);
    });

    it('Player should not be able to hit npc', () => {
        // const { players, engineManager, npcDataPackage } = setupEngine({ spell: { casterImpact: false, playersImpact: false }, amountOfPlayers: 2 });
        // let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        // const npc: Npc = _.find(npcDataPackage.character.data, (character: CharacterUnion) => character.type === CharacterType.Npc);

        // engineManager.callPlayerAction(players['1'].socketId, {
        //     type: PlayerClientActions.CastSpell,
        //     directionLocation: npc.location,
        //     spellId: '1',
        //     targetId: npc.id
        // })

        // dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        // checkIfErrorWasHandled(GlobalStoreModule.CHARACTER_POWER_POINTS, 'Invalid target.', dataPackage);
    });
});
