import { CharacterClass, CharacterLostHpEvent, EngineEventType, GlobalStoreModule } from '@bananos/types';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import { now } from 'lodash';
import React, { useEffect, useState } from 'react';
import styles from './Details.module.scss';
import { Header } from './Header/Header';
import { Player } from './Player/Player';
import { useDetailsStats } from './hooks/useDetailsStats';

export enum States {
    Damage = "Damage Done",
    Heal = "Heal Done",
    DamageTaken = "Damage Taken"
}

interface DetailsInternalProps {
    lastUpdateTime: string,
    characterPowerPointsEvents: CharacterLostHpEvent[],
    combatState: Record<string, boolean>,
    activeCharacterId: string,
    characters: Record<string, any>,
    characterClasses: Record<string, CharacterClass>,
}

export const Details = () => {
    const { activeCharacterId } = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER).data;
    const { data: characterClasses } = useEngineModuleReader(GlobalStoreModule.CHARACTER_CLASS);
    const { data: characters, lastUpdateTime: lastUpdateTimeCharacters } = useEngineModuleReader(GlobalStoreModule.CHARACTER);
    const { events: characterPowerPointsEvents, lastUpdateTime: lastUpdateTimeCharacterPowerPoints } = useEngineModuleReader(GlobalStoreModule.CHARACTER_POWER_POINTS);
    const { data: combatState, lastUpdateTime: lastUpdateTimeCombatState } = useEngineModuleReader(GlobalStoreModule.COMBAT_STATE);

    return <DetailsInternal
        activeCharacterId={activeCharacterId as string}
        characters={characters as Record<string, any>}
        characterClasses={characterClasses as Record<string, CharacterClass>}
        combatState={combatState as Record<string, boolean>}
        characterPowerPointsEvents={characterPowerPointsEvents as CharacterLostHpEvent[]}
        lastUpdateTime={
            lastUpdateTimeCharacters?.toString() +
            lastUpdateTimeCharacterPowerPoints?.toString() +
            lastUpdateTimeCombatState?.toString()
        }
    />
}

export const DetailsInternal = React.memo(
    ({ characterPowerPointsEvents, characters, combatState, activeCharacterId, characterClasses }: DetailsInternalProps) => {

        const { detailsStats: damageStats, clearDetailsStats: clearDamage } = useDetailsStats({ characterPowerPointsEvents, eventPropertyId: 'attackerId', eventType: EngineEventType.CharacterLostHp });
        const { detailsStats: damageTakenStats, clearDetailsStats: clearDamageTaken } = useDetailsStats({ characterPowerPointsEvents, eventPropertyId: 'characterId', eventType: EngineEventType.CharacterLostHp });
        const { detailsStats: healStats, clearDetailsStats: clearHeal } = useDetailsStats({ characterPowerPointsEvents, eventPropertyId: 'healerId', eventType: EngineEventType.CharacterGotHp });

        useEffect(() => {
            if (combatState[activeCharacterId]) {
                updateStartFightTime(now());
                clearDamage();
                clearDamageTaken();
                clearHeal();
            } else {
                updateEndFightTime(now());
            }
        }, [combatState, activeCharacterId])

        const [activeState, changeActiveState] = useState(States.Damage);
        const [startFightTime, updateStartFightTime] = useState(0);
        const [endFightTime, updateEndFightTime] = useState(0);

        const fightTime = ((combatState[activeCharacterId] ? now() : endFightTime) - startFightTime) / 1000;

        const getActiveState = () => {
            if (activeState === States.DamageTaken) {
                return damageTakenStats;
            }

            if (activeState === States.Heal) {
                return healStats;
            }

            return damageStats;
        }

        const activeStatesDetails = getActiveState();

        return (
            <div className={styles.DetailsContainer}>
                <Header activeState={activeState} changeActiveState={changeActiveState} playersAmount={activeStatesDetails.length} />
                <div className={styles.PlayerList}>
                    {activeStatesDetails.map((damageStat, index) => (
                        <Player
                            highestAmount={activeStatesDetails[0].amount}
                            fightTime={fightTime} detailsStat={damageStat}
                            playerCharacter={characters[damageStat.id]}
                            index={index + 1}
                            characterClass={characterClasses[characters[damageStat.id].characterClassId]}
                        />
                    )
                    )}
                </div>
            </div>
        )
    },
    (oldProps, newProps) => oldProps.lastUpdateTime === newProps.lastUpdateTime
);
