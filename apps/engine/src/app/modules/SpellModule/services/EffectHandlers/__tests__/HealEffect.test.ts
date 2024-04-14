import { CharacterClientEvents, GlobalStoreModule, HealthPointsSource } from '@bananos/types';
import { checkIfPackageIsValid, prepareEngineManager } from 'apps/engine/src/app/testUtilities';
import { attackMonster } from '../../../testUtilities/Spell';
import _ = require('lodash');

describe('Heal effect', () => {
    it('Character should be healed when heal effect is applied', () => {
        const { engineManager, monsterDataPackage } = prepareEngineManager();

        const monsterIds = Object.keys(monsterDataPackage.character.data);

        attackMonster({
            engineManager,
            playerId: '1',
            spellId: '4',
            monsterId: monsterIds[0],
            location: monsterDataPackage.characterMovements.data[monsterIds[0]].location
        })

        const { dataPackage } = attackMonster({
            engineManager,
            playerId: '1',
            spellId: '5',
            monsterId: monsterIds[0],
            location: monsterDataPackage.characterMovements.data[monsterIds[0]].location
        })

        checkIfPackageIsValid(GlobalStoreModule.CHARACTER_POWER_POINTS, dataPackage, {
            data: {
                monster_0: {
                    currentHp: 100,
                },
                playerCharacter_1: {
                    currentSpellPower: 0,
                },
            },
            events: [
                {
                    id: "2",
                    amount: 100,
                    healerId: "playerCharacter_1",
                    characterId: "monster_0",
                    spellId: "5",
                    type: CharacterClientEvents.CharacterGotHp,
                    source: HealthPointsSource.Healing,
                    location: { x: 150, y: 100 }
                },
            ]
        });
    });

    it('Character heal should be spread if value is set to be spread', () => {
        const { engineManager, monsterDataPackage } = prepareEngineManager({
            amountOfMonsters: 2,
            spells: {
                4: { effectSpread: true },
                5: { effectSpread: true }
            }
        });

        const monsterIds = Object.keys(monsterDataPackage.character.data);

        attackMonster({
            engineManager,
            playerId: '1',
            spellId: '4',
            monsterId: monsterIds[0],
            location: monsterDataPackage.characterMovements.data[monsterIds[0]].location
        })

        const { dataPackage } = attackMonster({
            engineManager,
            playerId: '1',
            spellId: '5',
            monsterId: monsterIds[0],
            location: monsterDataPackage.characterMovements.data[monsterIds[0]].location
        })

        checkIfPackageIsValid(GlobalStoreModule.CHARACTER_POWER_POINTS, dataPackage, {
            data: {
                monster_0: {
                    currentHp: 100,
                },
                monster_1: {
                    currentHp: 100,
                },
                playerCharacter_1: {
                    currentSpellPower: 0,
                },
            },
            events: [
                {
                    id: "3",
                    amount: 50,
                    healerId: "playerCharacter_1",
                    characterId: "monster_0",
                    spellId: "5",
                    type: CharacterClientEvents.CharacterGotHp,
                    source: HealthPointsSource.Healing,
                    location: { x: 150, y: 100 }
                },
                {
                    id: "4",
                    amount: 50,
                    healerId: "playerCharacter_1",
                    characterId: "monster_1",
                    spellId: "5",
                    type: CharacterClientEvents.CharacterGotHp,
                    source: HealthPointsSource.Healing,
                    location: { x: 150, y: 100 }
                },
            ]
        });
    });

});
