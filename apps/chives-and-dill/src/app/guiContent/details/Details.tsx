import { CharacterClass, CharacterClientEvents, CharacterLostHpEvent, GlobalStoreModule } from '@bananos/types';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import { now } from 'lodash';
import React, { useEffect, useState } from 'react';
import styles from './Details.module.scss';
import { Header } from './Header/Header';
import { Player } from './Player/Player';
import { DetailsStats, useDetailsStats } from './hooks/useDetailsStats';
import { useStatsAgregator } from './hooks/useStatsAgregrator';

export enum States {
    Damage = "DamageDone",
    Heal = "HealDone",
    DamageTaken = "DamageTaken"
}

export enum FightScope {
    Current = "Current",
    Overall = "Overall"
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

        const { detailsStats: damageStats, clearDetailsStats: clearDamage } = useDetailsStats({ characterPowerPointsEvents, eventPropertyId: 'attackerId', eventType: CharacterClientEvents.CharacterLostHp });
        const { detailsStats: damageTakenStats, clearDetailsStats: clearDamageTaken } = useDetailsStats({ characterPowerPointsEvents, eventPropertyId: 'characterId', eventType: CharacterClientEvents.CharacterLostHp });
        const { detailsStats: healStats, clearDetailsStats: clearHeal } = useDetailsStats({ characterPowerPointsEvents, eventPropertyId: 'healerId', eventType: CharacterClientEvents.CharacterGotHp });

        const { addFightsStats, fightHistory } = useStatsAgregator();

        const [activeState, changeActiveState] = useState(States.Damage);
        const [startFightTime, updateStartFightTime] = useState(0);
        const [endFightTime, updateEndFightTime] = useState(0);
        const [activeFight, setActiveFight] = useState(FightScope.Current);
        const [isFightPending, setIsFightPending] = useState(false);

        let fightTime = ((combatState[activeCharacterId] ? now() : endFightTime) - startFightTime) / 1000;
        if (activeFight !== FightScope.Current) {
            fightTime = (fightHistory[activeFight].endFightTime - fightHistory[activeFight].startFightTime) / 1000
        }

        useEffect(() => {
            if (combatState[activeCharacterId] && !isFightPending) {
                setIsFightPending(true);
            }

            if (!combatState[activeCharacterId] && isFightPending) {
                setIsFightPending(false);
            }
        }, [combatState[activeCharacterId], activeCharacterId, isFightPending]);

        useEffect(() => {
            if (isFightPending) {
                updateStartFightTime(now());
                clearDamage();
                clearDamageTaken();
                clearHeal();
            } else if (startFightTime !== 0) {
                updateEndFightTime(now());
                addFightsStats({
                    startFightTime,
                    endFightTime: now(),
                    details: {
                        [States.Damage]: damageStats,
                        [States.DamageTaken]: damageTakenStats,
                        [States.Heal]: healStats,
                    }
                });
            }
        }, [isFightPending]);

        const getActiveState = () => {
            let currentDetails: Record<States, DetailsStats[]>;
            if (activeFight === FightScope.Current) {
                currentDetails = {
                    [States.Damage]: damageStats,
                    [States.DamageTaken]: damageTakenStats,
                    [States.Heal]: healStats,
                }
            } else {
                currentDetails = fightHistory[activeFight].details;
            }

            if (activeState === States.DamageTaken) {
                return currentDetails.DamageTaken;
            }

            if (activeState === States.Heal) {
                return currentDetails.HealDone;
            }

            return currentDetails.DamageDone;
        }

        const activeStatesDetails = getActiveState();

        return (
            <div className={styles.DetailsContainer}>
                <Header
                    activeState={activeState}
                    changeActiveState={changeActiveState}
                    playersAmount={activeStatesDetails.length}
                    fightHistory={fightHistory}
                    setActiveFight={setActiveFight}
                />
                <div className={styles.PlayerList}>
                    {activeStatesDetails.map((damageStat, index) => (
                        <Player
                            highestAmount={activeStatesDetails[0].amount}
                            fightTime={fightTime}
                            detailsStat={damageStat}
                            playerCharacter={characters[damageStat.id]}
                            key={index}
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
