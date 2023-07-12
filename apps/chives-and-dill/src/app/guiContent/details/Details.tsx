import { CharacterClass, CharacterLostHpEvent, EngineEventType, GlobalStoreModule, HealthPointsSource, PowerPointsTrack } from '@bananos/types';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import React, { useEffect, useState } from 'react';
import styles from './Details.module.scss';
import { Player } from './Player/Player';
import { Header } from './Header/Header';
import _, { now } from 'lodash';

enum States {
  Damage = "Damage Done",
  Heal = "Heal Done",
  DamageTaken = "Damage Taken"
}

export interface DatailsStats {
  id: string,
  amount: number,
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

    useEffect(() => {
      if (combatState[activeCharacterId]) {
        updateStartFightTime(now());
        updateDamageStats([]);
      } else {
        updateEndFightTime(now());
      }
    }, [combatState, activeCharacterId])

    const [activeState, changeActiveState] = useState(States.Damage);
    const [startFightTime, updateStartFightTime] = useState(0);
    const [endFightTime, updateEndFightTime] = useState(0);
    const [damageStats, updateDamageStats] = useState<DatailsStats[]>([]);
    const fightTime = ((combatState[activeCharacterId] ? now() : endFightTime) - startFightTime) / 1000;

    useEffect(() => {
      const events = characterPowerPointsEvents.filter((event) => (event.type === EngineEventType.CharacterLostHp)) as CharacterLostHpEvent[];
      const toUpdateDamageStats = _.cloneDeep(damageStats);

      events.forEach(event => {
        let stateIndexId = _.findIndex(toUpdateDamageStats, (damageStat) => { return damageStat.id === event.attackerId; });
        if (stateIndexId === -1) {
          toUpdateDamageStats.push({
            id: event.attackerId,
            amount: 0,
          });
          stateIndexId = toUpdateDamageStats.length - 1;
        }
        toUpdateDamageStats[stateIndexId].amount += event.amount;

        while (stateIndexId !== 0 && toUpdateDamageStats[stateIndexId].amount > toUpdateDamageStats[stateIndexId - 1].amount) {
          const temp = toUpdateDamageStats[stateIndexId];
          toUpdateDamageStats[stateIndexId] = toUpdateDamageStats[stateIndexId - 1];
          toUpdateDamageStats[stateIndexId - 1] = temp;
          stateIndexId--;
        }

      });

      updateDamageStats(toUpdateDamageStats);

    }, [characterPowerPointsEvents])

    return (
      <div className={styles.DetailsContainer}>
        <Header activeState={activeState} changeActiveState={changeActiveState} playersAmount={damageStats.length} />
        <div className={styles.PlayerList}>
          {damageStats.map((damageStat, index) => (
            <Player fightTime={fightTime} damageStat={damageStat} playerCharacter={characters[damageStat.id]} index={index + 1} characterClass={characterClasses[characters[damageStat.id].characterClassId]} />
          ))}
        </div>
      </div>
    )
  },
  (oldProps, newProps) => oldProps.lastUpdateTime === newProps.lastUpdateTime
);
