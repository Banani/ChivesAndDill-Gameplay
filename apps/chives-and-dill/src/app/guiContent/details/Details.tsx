import { GlobalStoreModule } from '@bananos/types';
import { useEngineModuleReader } from 'apps/chives-and-dill/src/hooks';
import React, { useEffect, useState } from 'react';
import styles from './Details.module.scss';
import { Player } from './Player/Player';
import { Header } from './Header/Header';

enum States {
  Damage = "Damage Done",
  Heal = "Heal Done",
  DamageTaken = "Damage Taken"
}

export const Details = () => {
  const { activeCharacterId } = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER).data;
  const { data: characters } = useEngineModuleReader(GlobalStoreModule.CHARACTER);
  const { events: characterPowerPointsEvents } = useEngineModuleReader(GlobalStoreModule.CHARACTER_POWER_POINTS);
  const { data: combatState } = useEngineModuleReader(GlobalStoreModule.COMBAT_STATE);

  useEffect(() => {
    if (combatState[activeCharacterId]) {
      console.log("start");
      updateStartFightTime(new Date().getTime());
    } else {
      console.log("end");
      updateStartFightTime(0);
    }
  }, [combatState, activeCharacterId])

  const [activeState, changeActiveState] = useState(States.Damage);
  const [startFightTime, updateStartFightTime] = useState(0);

  return (
    <div className={styles.DetailsContainer}>
      <Header activeState={activeState} changeActiveState={changeActiveState} />
      <div className={styles.PlayerList}>
        <Player />
        <Player />
        <Player />
        <Player />
        <Player />
      </div>
    </div>
  )
}